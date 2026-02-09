import type { Question } from './types';

export const mockQuestions: Question[] = [
    {
        id: '1',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays',
        acceptanceRate: 49.5,
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        constraints: [
            '2 <= nums.length <= 10^4',
            '-10^9 <= nums[i] <= 10^9',
            '-10^9 <= target <= 10^9'
        ],
        examples: [
            {
                input: 'nums = [2,7,11,15], target = 9',
                output: '[0,1]',
                explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
            }
        ],
        hints: [
            { id: 1, content: 'A really brute force way would be to search for all possible pairs of numbers but that would be O(n^2). Is there a way to do it faster?' },
            { id: 2, content: 'Keep track of the complement (target - nums[i]) using a Hash Map.' }
        ],
        solutions: [
            {
                language: 'typescript',
                code: 'function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement)!, i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
                explanation: 'We use a hash map to store the values we have seen so far and their indices. For each number, we check if its complement exists in the map.'
            }
        ]
    },
    {
        id: '2',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
        acceptanceRate: 72.1,
        description: 'Given the `head` of a singly linked list, reverse the list, and return the reversed list.',
        constraints: [
            'The number of nodes in the list is the range [0, 5000].',
            '-5000 <= Node.val <= 5000'
        ],
        examples: [
            {
                input: 'head = [1,2,3,4,5]',
                output: '[5,4,3,2,1]'
            }
        ],
        hints: [
            { id: 1, content: 'Can you do it iteratively and recursively?' },
            { id: 2, content: 'Maintain three pointers: prev, curr, and next.' }
        ],
        solutions: [
            {
                language: 'typescript',
                code: 'function reverseList(head: ListNode | null): ListNode | null {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
                explanation: 'Iterate through the list, flipping the `next` pointer of each node to point to the previous node.'
            }
        ]
    },
    {
        id: '3',
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        acceptanceRate: 32.4,
        description: 'Given a string `s`, return the longest palindromic substring in `s`.',
        constraints: [
            '1 <= s.length <= 1000',
            's consists of only digits and English letters.'
        ],
        examples: [
            {
                input: 's = "babad"',
                output: '"bab"',
                explanation: '"aba" is also a valid answer.'
            }
        ],
        hints: [
            { id: 1, content: 'Try expanding around each character as a potential center.' }
        ],
        solutions: []
    },
    {
        id: '4',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
        acceptanceRate: 40.3,
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
        constraints: [
            '1 <= s.length <= 10^4',
            's consists of parentheses only \'()[]{}\'.'
        ],
        examples: [
            {
                input: 's = "()[]{}"',
                output: 'true'
            },
            {
                input: 's = "(]"',
                output: 'false'
            }
        ],
        hints: [
            { id: 1, content: 'Use a stack to keep track of open parentheses.' }
        ],
        solutions: []
    },
    {
        id: '5',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
        acceptanceRate: 50.1,
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
        constraints: [
            '1 <= nums.length <= 10^5',
            '-10^4 <= nums[i] <= 10^4'
        ],
        examples: [
            {
                input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
                output: '6',
                explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
            }
        ],
        hints: [
            { id: 1, content: 'Kadane\'s Algorithm is the most efficient approach here.' }
        ],
        solutions: []
    },
    {
        id: '6',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'Sorting',
        acceptanceRate: 46.2,
        description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
        constraints: [
            '1 <= intervals.length <= 10^4',
            'intervals[i].length == 2',
            '0 <= starti <= endi <= 10^4'
        ],
        examples: [
            {
                input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
                output: '[[1,6],[8,10],[15,18]]',
                explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].'
            }
        ],
        hints: [
            { id: 1, content: 'Sort the intervals by their start time first.' }
        ],
        solutions: []
    },
    {
        id: '7',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Arrays',
        acceptanceRate: 54.4,
        description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.',
        constraints: [
            '1 <= prices.length <= 10^5',
            '0 <= prices[i] <= 10^4'
        ],
        examples: [
            {
                input: 'prices = [7,1,5,3,6,4]',
                output: '5',
                explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
            }
        ],
        hints: [
            { id: 1, content: 'Keep track of the minimum price encountered so far.' }
        ],
        solutions: []
    }
];
