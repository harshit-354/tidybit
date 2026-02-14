import type { TestCase } from '../data/types';

export interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    error?: string;
}

export interface RunResult {
    testCaseResults: TestCaseResult[];
    allPassed: boolean;
    totalTime: number;
    error?: string;
}

/**
 * Strips TypeScript type annotations from code so it can run as plain JS.
 * This is a lightweight transform — not a full TS compiler.
 */
function stripTypeAnnotations(code: string): string {
    // Remove type imports
    let stripped = code.replace(/import\s+type\s+.*?;/g, '');
    // Remove : Type annotations on parameters  e.g.  (nums: number[], target: number)
    stripped = stripped.replace(/:\s*(?:number|string|boolean|any|void|null|undefined|never|unknown|object)(?:\[\])*(?:\s*\|\s*(?:number|string|boolean|any|void|null|undefined|never|unknown|object)(?:\[\])*)*/g, '');
    // Remove generic type parameters like <number, number> but not comparison operators
    stripped = stripped.replace(/\b(?:Map|Set|Array|Record|Promise)\s*<[^>]*>/g, (match) => {
        const base = match.split('<')[0];
        return base;
    });
    // Remove non-null assertions
    stripped = stripped.replace(/!\./g, '.');
    stripped = stripped.replace(/!,/g, ',');
    stripped = stripped.replace(/!\)/g, ')');
    stripped = stripped.replace(/!\]/g, ']');
    return stripped;
}

/**
 * Executes user code against test cases for a given question.
 * Supports JavaScript/TypeScript and Python (via Pyodide).
 */
export async function runCode(
    code: string,
    functionName: string,
    testCases: TestCase[],
    language: string
): Promise<RunResult> {
    const startTime = performance.now();
    const results: TestCaseResult[] = [];

    // Handle Python execution
    if (language === 'python') {
        try {
            // @ts-ignore - Pyodide is loaded via script tag
            if (!window.loadPyodide) {
                throw new Error('Pyodide is not loaded. Please check your internet connection.');
            }

            // @ts-ignore
            if (!window.pyodide) {
                // @ts-ignore
                window.pyodide = await window.loadPyodide();
            }

            // @ts-ignore
            const pyodide = window.pyodide;

            for (const tc of testCases) {
                try {
                    const args: unknown[] = JSON.parse(tc.input);
                    // Standard Python runner: define function, then call it with JSON-serialized args
                    const pyCode = `
import json
${code}
result = ${functionName}(*json.loads('${JSON.stringify(args)}'))
json.dumps(result)
                    `;
                    const actualOutput = await pyodide.runPythonAsync(pyCode);

                    const normalizedExpected = JSON.stringify(JSON.parse(tc.expectedOutput));
                    const normalizedActual = JSON.stringify(JSON.parse(actualOutput));

                    results.push({
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput,
                        passed: normalizedExpected === normalizedActual,
                    });
                } catch (err: unknown) {
                    results.push({
                        input: tc.input,
                        expectedOutput: tc.expectedOutput,
                        actualOutput: '',
                        passed: false,
                        error: String(err),
                    });
                }
            }

            const totalTime = Math.round(performance.now() - startTime);
            return { testCaseResults: results, allPassed: results.every(r => r.passed), totalTime };
        } catch (err: unknown) {
            return {
                testCaseResults: [],
                allPassed: false,
                totalTime: 0,
                error: `Python Initialization Error: ${err instanceof Error ? err.message : String(err)}`,
            };
        }
    }

    // For other non-JS languages
    if (language !== 'typescript' && language !== 'javascript') {
        return {
            testCaseResults: testCases.map((tc) => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: '—',
                passed: false,
                error: `Client-side execution is only supported for JS/TS and Python.`,
            })),
            allPassed: false,
            totalTime: 0,
            error: `Language "${language}" is not supported for client-side execution.`,
        };
    }

    // Handle JS/TS execution
    for (const tc of testCases) {
        try {
            const args: unknown[] = JSON.parse(tc.input);
            const jsCode = stripTypeAnnotations(code);
            const body = `
                ${jsCode}
                return JSON.stringify(${functionName}(...${JSON.stringify(args)}));
            `;

            const fn = new Function(body);
            const actualOutput = fn();

            const normalizedExpected = JSON.stringify(JSON.parse(tc.expectedOutput));
            const normalizedActual = JSON.stringify(JSON.parse(actualOutput));

            results.push({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput,
                passed: normalizedExpected === normalizedActual,
            });
        } catch (err: unknown) {
            results.push({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: '',
                passed: false,
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    const totalTime = Math.round(performance.now() - startTime);
    return { testCaseResults: results, allPassed: results.every((r) => r.passed), totalTime };
}
