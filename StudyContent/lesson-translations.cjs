// Authored lessons, not automatic code translation. Every variant has its own explanation.
const examples = {
  csharp: `using System;

public enum ApplicationStatus
{
    Draft,
    Applied,
    Interview,
    Offer,
    Rejected
}

public static class Program
{
    public static void Main()
    {
        ApplicationStatus status = ApplicationStatus.Draft;
        status = ApplicationStatus.Applied;

        if (status == ApplicationStatus.Applied)
        {
            Console.WriteLine("Application submitted!");
        }

        Console.WriteLine((int)status); // Applied has the value 1
    }
}`,
  cpp: `#include <iostream>

enum class ApplicationStatus
{
    Draft,
    Applied,
    Interview,
    Offer,
    Rejected
};

int main()
{
    ApplicationStatus status = ApplicationStatus::Draft;
    status = ApplicationStatus::Applied;

    if (status == ApplicationStatus::Applied)
    {
        std::cout << "Application submitted!\\n";
    }

    std::cout << static_cast<int>(status) << '\\n'; // Applied is 1
}
`,
  python: `from enum import Enum


class ApplicationStatus(Enum):
    Draft = 0
    Applied = 1
    Interview = 2
    Offer = 3
    Rejected = 4


status = ApplicationStatus.Draft
status = ApplicationStatus.Applied

if status == ApplicationStatus.Applied:
    print("Application submitted!")

print(status.value)  # Applied has the value 1
`
};
const details = {
  csharp: {
    name: 'C#',
    explanation: '`ApplicationStatus` is the type; `Draft`, `Applied`, and the others are its named choices. Use a dot, as in `ApplicationStatus.Applied`. `public` makes the enum type accessible to other code. Here the declaration is outside `Program`, and the statements run inside `Main`.',
    values: 'C# assigns integer values starting at 0 by default, so Draft is 0 and Applied is 1. `(int)status` reads the underlying number; `status.ToString()` gives the member name for a named value. You can also assign explicit values in the declaration.',
    mistake: 'An enum is not a string: assigning `"Applied"` directly to this variable will not compile. Casting an arbitrary integer, such as `(ApplicationStatus)99`, IS allowed, but it can produce an unnamed value. Validate external values with `Enum.IsDefined(typeof(ApplicationStatus), value)` when your rules require a declared choice.',
    failure: 'Try `status = "Applied";` and read the compiler error, then undo the change. Separately try `(ApplicationStatus)99` and use `Enum.IsDefined` to detect the unnamed value.'
  },
  cpp: {
    name: 'C++17',
    explanation: '`ApplicationStatus` is the type; `Draft`, `Applied`, and the others are its named choices. Use `enum class` for a scoped enum and `::` to access a member, as in `ApplicationStatus::Applied`. The declaration ends with a semicolon. A namespace-level enum does not use the C# `public` keyword.',
    values: 'Values start at 0 by default, so Draft is 0 and Applied is 1. A scoped enum does not implicitly convert to an integer; use `static_cast<int>(status)` when you actually need the number. C++17 has no built-in enum-name string conversion.',
    mistake: 'Do not paste C# syntax such as `public enum` or `ApplicationStatus.Applied` into C++. Assigning a string or an ordinary integer directly to this scoped enum is rejected. An explicit cast can still construct an unnamed value, so validate external numbers against your allowed choices.',
    failure: 'Try `status = 99;` and read the compiler error, then undo the change. An explicit `static_cast<ApplicationStatus>(99)` is a different operation: do not assume a cast validates the choice.'
  },
  python: {
    name: 'Python 3',
    explanation: 'Import `Enum`, then define `ApplicationStatus` as a subclass. `ApplicationStatus` is the type; `Draft`, `Applied`, and the others are its named choices. Access members with a dot, as in `ApplicationStatus.Applied`.',
    values: 'The numbers here are assigned explicitly to match the C# and C++ examples. `status.value` reads the number and `status.name` reads the name. Regular Enum members are not interchangeable with integers: `ApplicationStatus.Applied == 1` is False.',
    mistake: 'Python variables can be reassigned to another type, so `status = "Applied"` would replace the enum with a string rather than raise a type error. Convert and validate input with `ApplicationStatus(value)` for a numeric value or `ApplicationStatus[name]` for a name, and handle ValueError or KeyError respectively.',
    failure: 'Try `ApplicationStatus(99)` in a separate experiment: it raises ValueError because 99 is not declared. Catch that error and show a friendly message instead of accepting the invalid choice.'
  }
};
function lesson(language) {
  const info = details[language];
  return `## In plain English

An enum gives names to a finite set of choices. This example uses an application status: Draft, Applied, Interview, Offer or Rejected.

## Why you use it

Enums make code clearer than unexplained integers or inconsistent strings. They name the allowed states; they do not automatically enforce which transitions your application permits.

## Small example

Complete ${info.name} console example:

\`\`\`${language}
${examples[language].trim()}
\`\`\`

## How it works

${info.explanation}

1. Start with Draft.
2. Assign Applied to the same variable.
3. Compare the current value with Applied and print a message.
4. Print the underlying numeric value.

## Expected output

\`\`\`text
Application submitted!
1
\`\`\`

${info.values}

## Common mistake

${info.mistake}

## Check your understanding

If you replace the second assignment with Offer, which lines will print? Why does the message disappear?

## Practice before completing

1. Type and run this complete example in your usual development environment. Study Hub displays the example; it does not execute it.
2. Predict the output before running it.
3. Change the second assignment to Offer, then to Rejected. The numeric output becomes 3, then 4; the application-submitted message is absent in both cases.
4. ${info.failure}
5. Rebuild the example without looking. Explain the difference between the enum type, a named member and the variable holding it. Separate syntax errors from invalid input at runtime.`;
}
const enums = Object.fromEntries(Object.keys(examples).map(language => [language, lesson(language)]));
module.exports = { 'chapter-48': enums, 'term-enum': enums };
