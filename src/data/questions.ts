import type { Question } from './types';

export const mockQuestions: Question[] = [
    {
        id: '1',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'Arrays',
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
                explanation: 'Use a hash map to store seen values and their indices for O(n) lookup.'
            },
            {
                language: 'javascript',
                code: 'var twoSum = function(nums, target) {\n    const map = {};\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (complement in map) {\n            return [map[complement], i];\n        }\n        map[nums[i]] = i;\n    }\n};',
                explanation: 'A simple object-based hash map approach for O(n) performance.'
            },
            {
                language: 'python',
                code: 'def twoSum(nums, target):\n    prevMap = {} # val -> index\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i',
                explanation: 'Store values in a dictionary to find the complement in a single pass.'
            },
            {
                language: 'cpp',
                code: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> prevMap;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (prevMap.find(diff) != prevMap.end()) {\n                return {prevMap[diff], i};\n            }\n            prevMap[nums[i]] = i;\n        }\n        return {};\n    }\n};',
                explanation: 'Using unordered_map for O(1) average time complexity on lookups.'
            },
            {
                language: 'java',
                code: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> prevMap = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (prevMap.containsKey(diff)) {\n                return new int[] { prevMap.get(diff), i };\n            }\n            prevMap.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}',
                explanation: 'Java implementation using HashMap for efficient complement lookup.'
            }
        ],
        solutionFunctionName: 'twoSum',
        testCases: [
            { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]' },
            { input: '[[3,2,4], 6]', expectedOutput: '[1,2]' },
            { input: '[[3,3], 6]', expectedOutput: '[0,1]' }
        ]
    },
    {
        id: '2',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'Linked List',
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
                code: 'function reverseList(head: any): any {\n  // For this mock environment, we handle array input/output\n  if (Array.isArray(head)) {\n    return [...head].reverse();\n  }\n  // Standard LinkedList reversal\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
                explanation: 'Reverses the sequence. In this mock runner, it handles array-based linked list representations.'
            },
            {
                language: 'python',
                code: 'def reverseList(head):\n    # For this mock environment, we handle array input/output\n    if isinstance(head, list):\n        return head[::-1]\n    \n    # Standard iterative approach for a real linked list\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
                explanation: 'Reverses the sequence. In this mock environment, it handles array-based linked list representations using slicing.'
            },
            {
                language: 'java',
                code: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        ListNode curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}',
                explanation: 'Classic iterative reversal in Java.'
            }
        ],
        solutionFunctionName: 'reverseList',
        testCases: [
            { input: '[[1,2,3,4,5]]', expectedOutput: '[5,4,3,2,1]' },
            { input: '[[1,2]]', expectedOutput: '[2,1]' },
            { input: '[[]]', expectedOutput: '[]' }
        ]
    },
    {
        id: '3',
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
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
        solutions: [
            {
                language: 'typescript',
                code: 'function longestPalindrome(s: string): string {\n  if (s.length < 2) return s;\n  let start = 0, maxLength = 1;\n  function expand(l: number, r: number) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      if (r - l + 1 > maxLength) {\n        start = l;\n        maxLength = r - l + 1;\n      }\n      l--; r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return s.substring(start, start + maxLength);\n}',
                explanation: 'Expand around each character (and between characters) to find the longest palindrome.'
            },
            {
                language: 'python',
                code: 'def longestPalindrome(s):\n    res = ""\n    for i in range(len(s)):\n        # odd length\n        l, r = i, i\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > len(res):\n                res = s[l:r+1]\n            l -= 1\n            r += 1\n        # even length\n        l, r = i, i + 1\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if (r - l + 1) > len(res):\n                res = s[l:r+1]\n            l -= 1\n            r += 1\n    return res',
                explanation: 'Efficiently find the longest palindrome by checking all possible centers.'
            }
        ],
        solutionFunctionName: 'longestPalindrome',
        testCases: [
            { input: '["babad"]', expectedOutput: '"bab"' },
            { input: '["cbbd"]', expectedOutput: '"bb"' },
            { input: '["a"]', expectedOutput: '"a"' }
        ]
    },
    {
        id: '4',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'Stack',
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
        solutions: [
            {
                language: 'typescript',
                code: 'function isValid(s: string): boolean {\n  const stack: string[] = [];\n  const map: Record<string, string> = { ")": "(", "}": "{", "]": "[" };\n  for (const char of s) {\n    if (map[char]) {\n      if (stack.pop() !== map[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}',
                explanation: 'Use a stack to match brackets. Opening brackets are pushed, closing ones must match the top.'
            },
            {
                language: 'python',
                code: 'def isValid(s):\n    Map = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for c in s:\n        if c not in Map:\n            stack.append(c)\n            continue\n        if not stack or stack[-1] != Map[c]:\n            return False\n        stack.pop()\n    return not stack',
                explanation: 'A stack ensures that the last opened bracket is the first one closed.'
            }
        ],
        solutionFunctionName: 'isValid',
        testCases: [
            { input: '["()"]', expectedOutput: 'true' },
            { input: '["()[]{}"]', expectedOutput: 'true' },
            { input: '["(]"]', expectedOutput: 'false' },
            { input: '["([)]"]', expectedOutput: 'false' }
        ]
    },
    {
        id: '5',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        category: 'Dynamic Programming',
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
        solutions: [
            {
                language: 'typescript',
                code: 'function maxSubArray(nums: number[]): number {\n  let maxSum = nums[0];\n  let currentSum = 0;\n  for (const n of nums) {\n    currentSum = Math.max(currentSum + n, n);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}',
                explanation: 'Kadane\'s algorithm: for each position, the max subarray ending there is either the current element or the element plus the previous max.'
            },
            {
                language: 'python',
                code: 'def maxSubArray(nums):\n    max_sum = nums[0]\n    cur_sum = 0\n    for n in nums:\n        cur_sum = max(cur_sum + n, n)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum',
                explanation: 'Iterate through the array while maintaining the maximum sum found so far.'
            }
        ],
        solutionFunctionName: 'maxSubArray',
        testCases: [
            { input: '[[-2,1,-3,4,-1,2,1,-5,4]]', expectedOutput: '6' },
            { input: '[[1]]', expectedOutput: '1' },
            { input: '[[5,4,-1,7,8]]', expectedOutput: '23' }
        ]
    },
    {
        id: '6',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'Sorting',
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
        solutions: [
            {
                language: 'typescript',
                code: 'function merge(intervals: number[][]): number[][] {\n  if (intervals.length === 0) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const result = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = result[result.length - 1];\n    const curr = intervals[i];\n    if (curr[0] <= last[1]) {\n      last[1] = Math.max(last[1], curr[1]);\n    } else {\n      result.push(curr);\n    }\n  }\n  return result;\n}',
                explanation: 'Sort by start time, then iterate and merge overlapping intervals.'
            },
            {
                language: 'python',
                code: 'def merge(intervals):\n    intervals.sort(key=lambda i: i[0])\n    output = [intervals[0]]\n    for start, end in intervals[1:]:\n        lastEnd = output[-1][1]\n        if start <= lastEnd:\n            output[-1][1] = max(lastEnd, end)\n        else:\n            output.append([start, end])\n    return output',
                explanation: 'Sort and then use a single pass to merge intervals.'
            }
        ],
        solutionFunctionName: 'merge',
        testCases: [
            { input: '[[[1,3],[2,6],[8,10],[15,18]]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
            { input: '[[[1,4],[4,5]]]', expectedOutput: '[[1,5]]' }
        ]
    },
    {
        id: '7',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'Arrays',
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
        solutions: [
            {
                language: 'typescript',
                code: 'function maxProfit(prices: number[]): number {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (const p of prices) {\n    minPrice = Math.min(minPrice, p);\n    maxProfit = Math.max(maxProfit, p - minPrice);\n  }\n  return maxProfit;\n}',
                explanation: 'Maintain the minimum price seen and calculate the profit for each subsequent price.'
            },
            {
                language: 'python',
                code: 'def maxProfit(prices):\n    l, r = 0, 1 # buy, sell\n    maxP = 0\n    while r < len(prices):\n        if prices[l] < prices[r]:\n            profit = prices[r] - prices[l]\n            maxP = max(maxP, profit)\n        else:\n            l = r\n        r += 1\n    return maxP',
                explanation: 'Use two pointers to find the maximum price difference.'
            }
        ],
        solutionFunctionName: 'maxProfit',
        testCases: [
            { input: '[[7,1,5,3,6,4]]', expectedOutput: '5' },
            { input: '[[7,6,4,3,1]]', expectedOutput: '0' }
        ]
    }
];
