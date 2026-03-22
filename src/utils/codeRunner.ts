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
 * Parses a JSON argument into a C++ literal string.
 */
function toCppLiteral(arg: any, isListNode: boolean): string {
    if (typeof arg === 'string') return `string("${arg}")`;
    if (typeof arg === 'number') return `${arg}`;
    if (typeof arg === 'boolean') return arg ? 'true' : 'false';
    if (Array.isArray(arg)) {
        if (arg.length === 0) return `vector<int>{}`;
        if (isListNode && typeof arg[0] === 'number') {
            return `toList(vector<int>{${arg.join(',')}})`;
        }
        if (Array.isArray(arg[0])) {
            const inners = arg.map(a => toCppLiteral(a, false));
            return `vector<vector<int>>{${inners.join(',')}}`;
        } else if (typeof arg[0] === 'string') {
            const inners = arg.map(a => toCppLiteral(a, false));
            return `vector<string>{${inners.join(',')}}`;
        } else {
            return `vector<int>{${arg.join(',')}}`;
        }
    }
    return '';
}

/**
 * Parses a JSON argument into a Java literal string.
 */
function toJavaLiteral(arg: any, isListNode: boolean): string {
    if (typeof arg === 'string') return `"${arg}"`;
    if (typeof arg === 'number') return `${arg}`;
    if (typeof arg === 'boolean') return arg ? "true" : "false";
    if (Array.isArray(arg)) {
        if (arg.length === 0) return `new int[]{}`;
        if (isListNode && typeof arg[0] === 'number') {
            return `toList(new int[]{${arg.join(',')}})`;
        }
        if (Array.isArray(arg[0])) {
            const inners = arg.map(a => toJavaLiteral(a, false));
            return `new int[][]{${inners.join(',')}}`;
        } else if (typeof arg[0] === 'string') {
            const inners = arg.map(a => toJavaLiteral(a, false));
            return `new String[]{${inners.join(',')}}`;
        } else {
            return `new int[]{${arg.join(',')}}`;
        }
    }
    return '';
}

/**
 * Executes user code against test cases for a given question.
 * Supports JavaScript/TypeScript, Python, C++, and Java.
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

    // Handle Remote Execution for C++ and Java
    if (language === 'cpp' || language === 'java') {
        const isListNode = code.includes('ListNode');
        
        for (const tc of testCases) {
            try {
                const args: any[] = JSON.parse(tc.input);
                let fullCode = '';

                if (language === 'cpp') {
                    const cppArgs = args.map(a => toCppLiteral(a, isListNode)).join(', ');
                    fullCode = `
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

ListNode* toList(const vector<int>& v) {
    ListNode dummy;
    ListNode* curr = &dummy;
    for(int n : v) { curr->next = new ListNode(n); curr = curr->next; }
    return dummy.next;
}

template <typename T>
void print(const vector<T>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        print(v[i]);
        if(i != v.size()-1) cout << ",";
    }
    cout << "]";
}
void print(int v) { cout << v; }
void print(string v) { cout << "\\"" << v << "\\""; }
void print(bool v) { cout << (v ? "true" : "false"); }
void print(ListNode* node) {
    cout << "[";
    while(node) {
        cout << node->val;
        if(node->next) cout << ",";
        node = node->next;
    }
    cout << "]";
}

${code}

int main() {
    Solution sol;
    auto res = sol.${functionName}(${cppArgs});
    print(res);
    return 0;
}
`;
                } else if (language === 'java') {
                    const javaArgs = args.map(a => toJavaLiteral(a, isListNode)).join(', ');
                    fullCode = `
import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

${code}

public class Main {
    static ListNode toList(int[] arr) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int n : arr) { curr.next = new ListNode(n); curr = curr.next; }
        return dummy.next;
    }

    static void print(int[] arr) {
        System.out.print("[");
        for (int i=0; i<arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length-1) System.out.print(",");
        }
        System.out.print("]");
    }
    
    static void print(int[][] arr) {
        System.out.print("[");
        for (int i=0; i<arr.length; i++) {
            print(arr[i]);
            if (i < arr.length-1) System.out.print(",");
        }
        System.out.print("]");
    }
    
    static void print(int n) { System.out.print(n); }
    static void print(String s) { System.out.print("\\"" + s + "\\""); }
    static void print(boolean b) { System.out.print(b); }
    static void print(ListNode node) {
        System.out.print("[");
        while(node != null) {
            System.out.print(node.val);
            if(node.next != null) System.out.print(",");
            node = node.next;
        }
        System.out.print("]");
    }

    public static void main(String[] args) {
        Solution sol = new Solution();
        print(sol.${functionName}(${javaArgs}));
    }
}
`;
                }

                // Call Piston API
                const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: language,
                        version: language === 'cpp' ? '10.2.0' : '15.0.2',
                        files: [{ name: language === 'cpp' ? 'main.cpp' : 'Main.java', content: fullCode }],
                        compile_timeout: 10000,
                        run_timeout: 3000
                    })
                });

                const data = await response.json();
                
                if (data.message) {
                    throw new Error(`Execution API Error: ${data.message}`);
                }
                
                if (!data.run) {
                    throw new Error(`Failed to execute: ${JSON.stringify(data)}`);
                }

                if (data.compile && data.compile.code !== 0) {
                    throw new Error(`Compilation Error: ${data.compile.output}`);
                }
                
                if (data.run.code !== 0) {
                    throw new Error(`Runtime Error: ${data.run.output}`);
                }

                const actualOutput = (data.run.output || '').trim();

                const normalizedExpected = JSON.stringify(JSON.parse(tc.expectedOutput));
                let passed = false;
                try {
                    const normalizedActual = JSON.stringify(JSON.parse(actualOutput));
                    passed = normalizedExpected === normalizedActual;
                } catch {
                    passed = tc.expectedOutput.trim() === actualOutput;
                }

                results.push({
                    input: tc.input,
                    expectedOutput: tc.expectedOutput,
                    actualOutput,
                    passed: passed,
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
        return { testCaseResults: results, allPassed: results.every(r => r.passed), totalTime };
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
