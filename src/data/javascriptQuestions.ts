import type { ContestQuestion } from '../types/contest';

export const javascriptQuestions: ContestQuestion[] = [
  // --- EASY QUESTIONS ---
  {
    id: "js-easy-1",
    title: "Array Sum",
    difficulty: "Easy",
    description: "Write a function `sumArray` that takes an array of numbers and returns their sum. If the array is empty, return 0.",
    constraints: [
      "0 <= array.length <= 1000",
      "-10^4 <= array[i] <= 10^4"
    ],
    examples: [
      { input: "[1, 2, 3]", output: "6" },
      { input: "[-1, 1, 0]", output: "0" }
    ],
    testCases: [
      { input: "[[1, 2, 3]]", expectedOutput: "6" },
      { input: "[[-1, 1, 0]]", expectedOutput: "0" },
      { input: "[[]]", expectedOutput: "0" },
      { input: "[[10, 20, 30, 40]]", expectedOutput: "100" }
    ],
    solutionFunctionName: "sumArray",
    scoreValue: 10
  },
  {
    id: "js-easy-2",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function `reverseString` that takes a string and returns the reversed version of it.",
    constraints: [
      "1 <= string.length <= 1000",
      "string consists of printable ASCII characters"
    ],
    examples: [
      { input: "\"hello\"", output: "\"olleh\"" },
      { input: "\"world\"", output: "\"dlrow\"" }
    ],
    testCases: [
      { input: "[\"hello\"]", expectedOutput: "\"olleh\"" },
      { input: "[\"world\"]", expectedOutput: "\"dlrow\"" },
      { input: "[\"a\"]", expectedOutput: "\"a\"" },
      { input: "[\"ab\"]", expectedOutput: "\"ba\"" }
    ],
    solutionFunctionName: "reverseString",
    scoreValue: 10
  },
  {
    id: "js-easy-3",
    title: "Find Maximum",
    difficulty: "Easy",
    description: "Write a function `findMax` that takes an array of numbers and returns the maximum number. If the array is empty, return null.",
    constraints: [
      "0 <= array.length <= 1000",
      "-10^4 <= array[i] <= 10^4"
    ],
    examples: [
      { input: "[1, 5, 3, 9, 2]", output: "9" },
      { input: "[-5, -1, -3]", output: "-1" }
    ],
    testCases: [
      { input: "[[1, 5, 3, 9, 2]]", expectedOutput: "9" },
      { input: "[[-5, -1, -3]]", expectedOutput: "-1" },
      { input: "[[]]", expectedOutput: "null" },
      { input: "[[10]]", expectedOutput: "10" }
    ],
    solutionFunctionName: "findMax",
    scoreValue: 10
  },
  {
    id: "js-easy-4",
    title: "Check Palindrome",
    difficulty: "Easy",
    description: "Write a function `isPalindrome` that takes a string and returns a boolean indicating whether the string is a palindrome (reads the same forwards and backwards). Ignore spaces and casing.",
    constraints: [
      "1 <= string.length <= 10^5",
      "string consists of printable ASCII characters"
    ],
    examples: [
      { input: "\"racecar\"", output: "true" },
      { input: "\"hello\"", output: "false" }
    ],
    testCases: [
      { input: "[\"racecar\"]", expectedOutput: "true" },
      { input: "[\"hello\"]", expectedOutput: "false" },
      { input: "[\"A man a plan a canal Panama\"]", expectedOutput: "true" },
      { input: "[\"a\"]", expectedOutput: "true" }
    ],
    solutionFunctionName: "isPalindrome",
    scoreValue: 10
  },

  // --- MEDIUM QUESTIONS ---
  {
    id: "js-medium-1",
    title: "Two Sum",
    difficulty: "Medium",
    description: "Write a function `twoSum` that takes an array of integers `nums` and an integer `target`, and returns the indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    examples: [
      { input: "[2, 7, 11, 15], 9", output: "[0, 1]" },
      { input: "[3, 2, 4], 6", output: "[1, 2]" }
    ],
    testCases: [
      { input: "[[2, 7, 11, 15], 9]", expectedOutput: "[0, 1]" },
      { input: "[[3, 2, 4], 6]", expectedOutput: "[1, 2]" },
      { input: "[[3, 3], 6]", expectedOutput: "[0, 1]" }
    ],
    solutionFunctionName: "twoSum",
    scoreValue: 20
  },
  {
    id: "js-medium-2",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Write a function `lengthOfLongestSubstring` that takes a string `s` and returns the length of the longest substring without repeating characters.",
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      { input: "\"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." },
      { input: "\"bbbbb\"", output: "1", explanation: "The answer is \"b\", with the length of 1." }
    ],
    testCases: [
      { input: "[\"abcabcbb\"]", expectedOutput: "3" },
      { input: "[\"bbbbb\"]", expectedOutput: "1" },
      { input: "[\"pwwkew\"]", expectedOutput: "3" },
      { input: "[\"\"]", expectedOutput: "0" }
    ],
    solutionFunctionName: "lengthOfLongestSubstring",
    scoreValue: 20
  },
  {
    id: "js-medium-3",
    title: "Group Anagrams",
    difficulty: "Medium",
    description: "Write a function `groupAnagrams` that takes an array of strings `strs` and groups the anagrams together. You can return the answer in any order.",
    constraints: [
      "1 <= strs.length <= 10^4",
      "0 <= strs[i].length <= 100",
      "strs[i] consists of lowercase English letters."
    ],
    examples: [
      { input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
      { input: "[\"\"]", output: "[[\"\"]]" }
    ],
    testCases: [
      { input: "[[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]]", expectedOutput: "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]" }, // Note test order might be tricky to match exactly
      { input: "[[\"\"]]", expectedOutput: "[[\"\"]]" },
      { input: "[[\"a\"]]", expectedOutput: "[[\"a\"]]" }
    ],
    solutionFunctionName: "groupAnagrams",
    scoreValue: 20
  },
  {
    id: "js-medium-4",
    title: "Container With Most Water",
    difficulty: "Medium",
    description: "Write a function `maxArea` that takes an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.",
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4"
    ],
    examples: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "[1,1]", output: "1" }
    ],
    testCases: [
      { input: "[[1,8,6,2,5,4,8,3,7]]", expectedOutput: "49" },
      { input: "[[1,1]]", expectedOutput: "1" },
      { input: "[[4,3,2,1,4]]", expectedOutput: "16" },
      { input: "[[1,2,1]]", expectedOutput: "2" }
    ],
    solutionFunctionName: "maxArea",
    scoreValue: 20
  },

  // --- HARD QUESTIONS ---
  {
    id: "js-hard-1",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "Write a function `mergeKLists` that takes an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it. (Assuming linked lists are represented as arrays for this JS challenge).",
    constraints: [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500",
      "-10^4 <= lists[i][j] <= 10^4",
      "lists[i] is sorted in ascending order."
    ],
    examples: [
      { input: "[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
      { input: "[]", output: "[]" }
    ],
    testCases: [
      { input: "[[[1,4,5],[1,3,4],[2,6]]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { input: "[[]]", expectedOutput: "[]" },
      { input: "[[[]]]", expectedOutput: "[]" }
    ],
    solutionFunctionName: "mergeKLists",
    scoreValue: 30
  },
  {
    id: "js-hard-2",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Write a function `trap` that takes `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.",
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    examples: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "[4,2,0,3,2,5]", output: "9" }
    ],
    testCases: [
      { input: "[[0,1,0,2,1,0,1,3,2,1,2,1]]", expectedOutput: "6" },
      { input: "[[4,2,0,3,2,5]]", expectedOutput: "9" },
      { input: "[[1,0,1]]", expectedOutput: "1" },
      { input: "[[5,4,1,2]]", expectedOutput: "1" }
    ],
    solutionFunctionName: "trap",
    scoreValue: 30
  },
  {
    id: "js-hard-3",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    description: "Write a function `isMatch` that takes an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` and `'*'` where: `'.'` Matches any single character. `'*'` Matches zero or more of the preceding element.",
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 20",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, `'.'`, and `'*'`.",
      "It is guaranteed for each appearance of the character `'*'`, there will be a previous valid character to match."
    ],
    examples: [
      { input: "\"aa\", \"a\"", output: "false" },
      { input: "\"aa\", \"a*\"", output: "true" },
      { input: "\"ab\", \".*\"", output: "true" }
    ],
    testCases: [
      { input: "[\"aa\", \"a\"]", expectedOutput: "false" },
      { input: "[\"aa\", \"a*\"]", expectedOutput: "true" },
      { input: "[\"ab\", \".*\"]", expectedOutput: "true" },
      { input: "[\"aab\", \"c*a*b\"]", expectedOutput: "true" },
      { input: "[\"mississippi\", \"mis*is*p*.\"]", expectedOutput: "false" }
    ],
    solutionFunctionName: "isMatch",
    scoreValue: 30
  },
  {
    id: "js-hard-4",
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    description: "Write a function `maxSlidingWindow` that takes an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4",
      "1 <= k <= nums.length"
    ],
    examples: [
      { input: "[1,3,-1,-3,5,3,6,7], 3", output: "[3,3,5,5,6,7]" },
      { input: "[1], 1", output: "[1]" }
    ],
    testCases: [
      { input: "[[1,3,-1,-3,5,3,6,7], 3]", expectedOutput: "[3,3,5,5,6,7]" },
      { input: "[[1], 1]", expectedOutput: "[1]" },
      { input: "[[1,-1], 1]", expectedOutput: "[1,-1]" },
      { input: "[[9,11], 2]", expectedOutput: "[11]" },
      { input: "[[4,-2], 2]", expectedOutput: "[4]" }
    ],
    solutionFunctionName: "maxSlidingWindow",
    scoreValue: 30
  }
];
