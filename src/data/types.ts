export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Hint {
    id: number;
    content: string;
}

export interface Solution {
    language: string;
    code: string;
    explanation: string;
}

export interface ListNode {
    val: number;
    next: ListNode | null;
}

export interface TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
}

export interface Question {
    id: string;
    title: string;
    difficulty: Difficulty;
    category: string;
    description: string;
    constraints: string[];
    examples: {
        input: string;
        output: string;
        explanation?: string;
    }[];
    hints: Hint[];
    solutions: Solution[];
    testCases: TestCase[];
    solutionFunctionName: string;
}

export interface User {
    name: string;
    email: string;
    password?: string;
}
