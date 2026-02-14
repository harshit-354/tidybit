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
 * Only supports JavaScript/TypeScript (transpiled to JS).
 */
export function runCode(
    code: string,
    functionName: string,
    testCases: TestCase[],
    language: string
): RunResult {
    // For non-JS languages, simulate execution
    if (language !== 'typescript' && language !== 'javascript') {
        return {
            testCaseResults: testCases.map((tc) => ({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: '—',
                passed: false,
                error: `Client-side execution is only supported for JavaScript/TypeScript. ${language.charAt(0).toUpperCase() + language.slice(1)} support requires a backend server.`,
            })),
            allPassed: false,
            totalTime: 0,
            error: `Language "${language}" is not supported for client-side execution. Please switch to TypeScript or JavaScript.`,
        };
    }

    const startTime = performance.now();
    const results: TestCaseResult[] = [];

    for (const tc of testCases) {
        try {
            // Parse the input arguments from JSON
            const args: unknown[] = JSON.parse(tc.input);

            // Strip TS types so we can eval as JS
            const jsCode = stripTypeAnnotations(code);

            // Build the executable body: define the function, then call it
            const body = `
                ${jsCode}
                return JSON.stringify(${functionName}(...${JSON.stringify(args)}));
            `;

            // eslint-disable-next-line no-new-func
            const fn = new Function(body);
            const rawResult = fn();

            const actualOutput = rawResult;
            const normalizedExpected = JSON.stringify(JSON.parse(tc.expectedOutput));
            const normalizedActual = JSON.stringify(JSON.parse(actualOutput));

            results.push({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput,
                passed: normalizedExpected === normalizedActual,
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            results.push({
                input: tc.input,
                expectedOutput: tc.expectedOutput,
                actualOutput: '',
                passed: false,
                error: errorMessage,
            });
        }
    }

    const totalTime = Math.round(performance.now() - startTime);
    const allPassed = results.every((r) => r.passed);

    return { testCaseResults: results, allPassed, totalTime };
}
