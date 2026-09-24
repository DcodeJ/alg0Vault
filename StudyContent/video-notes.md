# C# Video Notes and Complete .NET Job Roadmap

**Goal:** go from beginner to a job-ready junior C#/.NET backend developer  
**Video:** [Bro Code — C# Full Course for free](https://www.youtube.com/watch?v=wxznTygnRfQ)  
**Video length:** 4 hours  
**Suggested pace:** 10–12 hours per week for approximately 9 months  
**Target stack:** C# 14, .NET 10 LTS, ASP.NET Core, SQL, Entity Framework Core, xUnit, Git, Docker and Azure

## Read this first

The video was published in 2021. Its programming ideas are still useful, but its Visual Studio screens and project template are older. Modern .NET console templates normally use **top-level statements**, so you might initially see this:

```csharp
Console.WriteLine("Hello, World!");
```

instead of an explicit `Program` class and `Main` method. Both forms are valid. Use [.NET 10 LTS](https://dotnet.microsoft.com/en-us/download/dotnet/10.0) for your own work.

The course is a strong introduction to C# syntax and object-oriented programming. It is **not a complete job curriculum**: it does not teach SQL, Entity Framework Core, ASP.NET Core APIs, testing, Git, Docker, deployment or job searching. The roadmap in the second half fills those gaps.

---

# Part 1 — How to study the video

Do not watch all four hours passively. For every chapter:

1. Watch the chapter once.
2. Pause and type the example yourself.
3. Run it and predict the output before looking.
4. Change at least two values or rules.
5. Break it deliberately and read the compiler error.
6. Rebuild the important part without the video.
7. Write a three-sentence explanation in your own words.
8. Commit the exercise to Git.

Use this folder structure:

```text
csharp-learning/
  video-course/
    01-output/
    02-variables/
    03-input-calculator/
    ...
  projects/
  notes/
```

Do not copy everything into one enormous `Program.cs`. Give each exercise its own small project or folder.

---

# Part 2 — Step-by-step video notes

## Module A — Setup, output and values

### 1. Introduction and setup — [00:00:00](https://www.youtube.com/watch?v=wxznTygnRfQ&t=0s)

C# is a statically typed language used for console programs, web applications, APIs, desktop software, cloud services and games. Code is compiled before it runs, which allows the compiler to find many mistakes early.

Important terms:

- **C#:** the programming language.
- **.NET:** the runtime, libraries and tools used to build and run C# applications.
- **Visual Studio:** an integrated development environment, or IDE.
- **Project:** a collection of code and configuration that produces an application or library.
- **Solution:** a container that can hold multiple related projects.

Modern setup:

1. Install the .NET 10 SDK.
2. Install Visual Studio Community.
3. Select **.NET desktop development** and **ASP.NET and web development**.
4. Confirm the installation with `dotnet --version`.
5. Create a console project with `dotnet new console -n FirstProgram`.
6. Run it with `dotnet run --project FirstProgram`.

### 2. Output — [00:06:30](https://www.youtube.com/watch?v=wxznTygnRfQ&t=390s)

Use `Console.WriteLine` to print text and then move to a new line. Use `Console.Write` to keep the cursor on the same line.

```csharp
Console.WriteLine("Welcome to C#!");
Console.Write("Your name: ");
Console.WriteLine("Damian");
```

Useful escape sequences:

```csharp
Console.WriteLine("First line\nSecond line");
Console.WriteLine("Column 1\tColumn 2");
Console.WriteLine("He said \"Hello\".");
Console.WriteLine("C:\\Projects\\Demo");
```

Remember:

- Most C# statements end with `;`.
- Text uses double quotes; a single character uses single quotes.
- C# is case-sensitive: `Console` and `console` are different.

**Practice:** print a three-line profile containing your name, degree and target job.

### 3. Variables — [00:10:48](https://www.youtube.com/watch?v=wxznTygnRfQ&t=648s)

A variable is a named location that stores a value.

```csharp
string name = "Anna";
int age = 21;
double averageGrade = 4.25;
decimal accountBalance = 1250.50m;
bool isStudent = true;
char grade = 'A';
```

Use:

- `int` for whole numbers.
- `double` for ordinary floating-point calculations.
- `decimal` for money.
- `bool` for true/false conditions.
- `string` for text.
- `char` for one character.

Choose descriptive names such as `monthlySalary`, not `x`. Local variables normally use `camelCase`.

```csharp
int applicationsSent = 4;
applicationsSent = applicationsSent + 1;
applicationsSent++;
```

**Practice:** store details of a job advertisement and print them.

### 4. Constants — [00:19:32](https://www.youtube.com/watch?v=wxznTygnRfQ&t=1172s)

A constant is assigned once and cannot be changed.

```csharp
const double Pi = 3.141592653589793;
const int MaximumAttempts = 3;
```

Use a constant when the value is fixed by the program's rules. Do not make a value constant merely because it happens not to change yet.

### 5. Type conversion — [00:20:35](https://www.youtube.com/watch?v=wxznTygnRfQ&t=1235s)

Type conversion changes a value from one type to another.

```csharp
int count = 5;
double widened = count;       // Safe implicit conversion
int shortened = (int)3.99;   // Explicit cast; result is 3
string text = count.ToString();
```

User input arrives as a string. Prefer `TryParse` when input can be invalid:

```csharp
Console.Write("Enter your age: ");
string? input = Console.ReadLine();

if (int.TryParse(input, out int age))
{
    Console.WriteLine($"Next year you will be {age + 1}.");
}
else
{
    Console.WriteLine("That was not a valid whole number.");
}
```

`Convert.ToInt32` and `int.Parse` throw exceptions for invalid text. `TryParse` lets you handle failure normally.

### 6. User input — [00:27:49](https://www.youtube.com/watch?v=wxznTygnRfQ&t=1669s)

`Console.ReadLine()` waits for the user and returns `string?`, meaning it may return text or `null`.

```csharp
Console.Write("What is your name? ");
string name = Console.ReadLine() ?? "Unknown";
Console.WriteLine($"Hello, {name}!");
```

Never trust input. Validate missing text, incorrect types and values outside the allowed range.

### 7. Arithmetic operators — [00:31:24](https://www.youtube.com/watch?v=wxznTygnRfQ&t=1884s)

```csharp
int sum = 10 + 3;          // 13
int difference = 10 - 3;   // 7
int product = 10 * 3;      // 30
int quotient = 10 / 3;     // 3: integer division
int remainder = 10 % 3;    // 1
double exact = 10.0 / 3;   // approximately 3.333
```

Operator precedence follows ordinary mathematics. Use parentheses when intent is not obvious.

```csharp
double average = (score1 + score2 + score3) / 3.0;
```

### 8. `Math` class — [00:35:54](https://www.youtube.com/watch?v=wxznTygnRfQ&t=2154s)

`Math` provides common mathematical operations.

```csharp
double rounded = Math.Round(4.567, 2);
double root = Math.Sqrt(81);
double power = Math.Pow(2, 8);
int larger = Math.Max(10, 25);
int smaller = Math.Min(10, 25);
double absolute = Math.Abs(-12.5);
```

### 9. Random numbers — [00:40:55](https://www.youtube.com/watch?v=wxznTygnRfQ&t=2455s)

Modern C# can use `Random.Shared`:

```csharp
int dieRoll = Random.Shared.Next(1, 7); // Upper limit is exclusive
double fraction = Random.Shared.NextDouble();
```

These values are suitable for games and simulations, not passwords or security tokens.

### 10. Hypotenuse calculator — [00:44:27](https://www.youtube.com/watch?v=wxznTygnRfQ&t=2667s)

This exercise combines input, conversion, arithmetic and output.

```csharp
Console.Write("Side A: ");
bool validA = double.TryParse(Console.ReadLine(), out double sideA);

Console.Write("Side B: ");
bool validB = double.TryParse(Console.ReadLine(), out double sideB);

if (validA && validB && sideA > 0 && sideB > 0)
{
    double hypotenuse = Math.Sqrt(sideA * sideA + sideB * sideB);
    Console.WriteLine($"Hypotenuse: {hypotenuse:F2}");
}
else
{
    Console.WriteLine("Enter two positive numbers.");
}
```

**Checkpoint A:** build a rectangle calculator that asks for width and height, then prints area, perimeter and diagonal.

---

## Module B — Text, decisions and repetition

### 11. String methods — [00:46:35](https://www.youtube.com/watch?v=wxznTygnRfQ&t=2795s)

Strings are immutable: operations return a new string instead of changing the original.

```csharp
string raw = "  Junior .NET Developer  ";
string clean = raw.Trim();

Console.WriteLine(clean.ToUpper());
Console.WriteLine(clean.ToLower());
Console.WriteLine(clean.Contains(".NET"));
Console.WriteLine(clean.Replace("Junior", "Intern"));
Console.WriteLine(clean.Length);
```

Other useful members include `StartsWith`, `EndsWith`, `IndexOf`, `Substring`, `Split` and `string.IsNullOrWhiteSpace`.

### 12. `if` statements — [00:53:26](https://www.youtube.com/watch?v=wxznTygnRfQ&t=3206s)

An `if` statement executes code only when its condition is true.

```csharp
if (yearsOfExperience >= 2)
{
    Console.WriteLine("Experience requirement met.");
}
else if (yearsOfExperience == 1)
{
    Console.WriteLine("Apply if the rest of the role fits.");
}
else
{
    Console.WriteLine("Look for internships and junior roles.");
}
```

Conditions use comparison operators such as `==`, `!=`, `<`, `>`, `<=` and `>=`. Do not confuse assignment `=` with equality `==`.

### 13. `switch` — [00:59:43](https://www.youtube.com/watch?v=wxznTygnRfQ&t=3583s)

Use a switch when one value maps to several clear cases.

```csharp
string message = status switch
{
    "Applied" => "Wait for a response",
    "Interview" => "Prepare examples",
    "Rejected" => "Record feedback and continue",
    _ => "Unknown status"
};
```

The video demonstrates the traditional `switch` statement. Modern switch expressions are often shorter when you are producing a value.

### 14. Logical operators — [01:02:50](https://www.youtube.com/watch?v=wxznTygnRfQ&t=3770s)

```csharp
bool eligible = isStudent && age >= 18; // Both must be true
bool isWeekend = day == "Saturday" || day == "Sunday"; // Either can be true
bool notFinished = !isFinished; // Negation
```

`&&` and `||` short-circuit: the right side is evaluated only when necessary.

### 15. `while` loops — [01:06:36](https://www.youtube.com/watch?v=wxznTygnRfQ&t=3996s)

A `while` loop repeats while its condition remains true.

```csharp
string? password = "";

while (string.IsNullOrWhiteSpace(password))
{
    Console.Write("Create a password: ");
    password = Console.ReadLine();
}
```

Make sure something inside the loop can make the condition false, or the loop may never finish.

### 16. `for` loops — [01:09:45](https://www.youtube.com/watch?v=wxznTygnRfQ&t=4185s)

Use `for` when you know how many repetitions are required.

```csharp
for (int attempt = 1; attempt <= 3; attempt++)
{
    Console.WriteLine($"Attempt {attempt}");
}
```

### 17. Nested loops — [01:13:24](https://www.youtube.com/watch?v=wxznTygnRfQ&t=4404s)

A nested loop places one loop inside another. It is useful for grids and combinations, but the amount of work multiplies.

```csharp
for (int row = 0; row < 3; row++)
{
    for (int column = 0; column < 4; column++)
    {
        Console.Write("#");
    }

    Console.WriteLine();
}
```

**Checkpoint B:** build a menu that repeats until the user selects Exit. Validate every selection.

---

## Module C — Three beginner projects

### 18. Number guessing game — [01:18:28](https://www.youtube.com/watch?v=wxznTygnRfQ&t=4708s)

Skills combined: random numbers, loops, input validation, comparisons and counters.

Recommended algorithm:

1. Generate a secret number from 1 to 100.
2. Set the attempt counter to zero.
3. Ask for a guess inside a loop.
4. Reject invalid input without ending the program.
5. Increment the counter for a valid guess.
6. Say whether the guess is too high or too low.
7. Finish when the guess equals the secret number.
8. Print the number of attempts.

Improvement: add a maximum number of attempts and a Play Again option.

### 19. Rock–paper–scissors — [01:27:08](https://www.youtube.com/watch?v=wxznTygnRfQ&t=5228s)

Skills combined: arrays, random selection, conditions, loops and normalization of input.

Separate the rules from input/output:

```csharp
static string DecideWinner(string player, string computer)
{
    if (player == computer) return "Draw";

    bool playerWins =
        (player == "rock" && computer == "scissors") ||
        (player == "paper" && computer == "rock") ||
        (player == "scissors" && computer == "paper");

    return playerWins ? "Player" : "Computer";
}
```

Improvement: track the score over multiple rounds.

### 20. Calculator — [01:38:52](https://www.youtube.com/watch?v=wxznTygnRfQ&t=5932s)

Skills combined: numeric input, switch, arithmetic and exceptional cases.

Handle:

- Invalid numbers
- Unknown operators
- Division by zero
- Repeating another calculation

Do not put the entire calculator in one giant method. Create methods such as `ReadNumber`, `Calculate` and `DisplayResult`.

**Checkpoint C:** rebuild one of the three projects from a blank project without replaying the video.

---

## Module D — Arrays and methods

### 21. Arrays — [01:46:53](https://www.youtube.com/watch?v=wxznTygnRfQ&t=6413s)

An array contains a fixed number of values of the same type. Indexes start at zero.

```csharp
string[] technologies = ["C#", ".NET", "SQL"];
Console.WriteLine(technologies[0]);
Console.WriteLine(technologies.Length);
```

The last valid index is `Length - 1`. Accessing an invalid index throws `IndexOutOfRangeException`.

### 22. `foreach` loop — [01:52:50](https://www.youtube.com/watch?v=wxznTygnRfQ&t=6770s)

Use `foreach` to read each value in a collection when you do not need its numeric index.

```csharp
foreach (string technology in technologies)
{
    Console.WriteLine(technology);
}
```

### 23. Methods — [01:54:42](https://www.youtube.com/watch?v=wxznTygnRfQ&t=6882s)

A method names a reusable operation.

```csharp
static void Greet(string name)
{
    Console.WriteLine($"Hello, {name}!");
}

Greet("Marta");
```

- A **parameter** is the variable in the method declaration.
- An **argument** is the value passed when calling the method.
- `void` means the method does not return a value.

Good methods perform one clear job and have intention-revealing names.

### 24. Returning values — [02:00:37](https://www.youtube.com/watch?v=wxznTygnRfQ&t=7237s)

```csharp
static decimal CalculateGross(decimal net, decimal taxRate)
{
    return net * (1 + taxRate);
}

decimal gross = CalculateGross(100m, 0.23m);
```

The declared return type must match the returned value. `return` also ends the current method.

### 25. Method overloading — [02:04:12](https://www.youtube.com/watch?v=wxznTygnRfQ&t=7452s)

Overloads share a name but have different parameter lists.

```csharp
static int Add(int a, int b) => a + b;
static int Add(int a, int b, int c) => a + b + c;
static double Add(double a, double b) => a + b;
```

The return type alone cannot distinguish overloads.

### 26. `params` — [02:05:44](https://www.youtube.com/watch?v=wxznTygnRfQ&t=7544s)

`params` accepts zero or more arguments as an array.

```csharp
static int AddAll(params int[] numbers)
{
    int total = 0;

    foreach (int number in numbers)
    {
        total += number;
    }

    return total;
}

int total = AddAll(2, 4, 6, 8);
```

Only the final parameter can use `params`.

**Checkpoint D:** refactor your calculator so each operation is a method and the menu contains almost no calculation logic.

---

## Module E — Errors and concise syntax

### 27. Exception handling — [02:08:52](https://www.youtube.com/watch?v=wxznTygnRfQ&t=7732s)

Exceptions represent failures that interrupt normal execution.

```csharp
try
{
    int number = int.Parse(Console.ReadLine() ?? "");
    Console.WriteLine(100 / number);
}
catch (FormatException)
{
    Console.WriteLine("Enter a whole number.");
}
catch (DivideByZeroException)
{
    Console.WriteLine("Zero is not allowed here.");
}
finally
{
    Console.WriteLine("Calculation finished.");
}
```

Prefer preventing expected input failures with `TryParse`. Catch exceptions you can handle meaningfully; do not hide all errors with an empty `catch`.

### 28. Conditional operator — [02:13:53](https://www.youtube.com/watch?v=wxznTygnRfQ&t=8033s)

The ternary operator selects one of two values:

```csharp
string result = score >= 50 ? "Pass" : "Fail";
```

Use it for short, readable expressions. Use an ordinary `if` for complicated logic.

### 29. String interpolation — [02:16:53](https://www.youtube.com/watch?v=wxznTygnRfQ&t=8213s)

```csharp
string company = "Contoso";
decimal salary = 7500m;

Console.WriteLine($"Company: {company}, salary: {salary:C}");
Console.WriteLine($"Progress: {0.756:P1}");
Console.WriteLine($"Date: {DateTime.Today:yyyy-MM-dd}");
```

Interpolation is normally clearer than joining many strings with `+`.

### 30. Multidimensional arrays — [02:20:18](https://www.youtube.com/watch?v=wxznTygnRfQ&t=8418s)

```csharp
int[,] matrix =
{
    { 1, 2, 3 },
    { 4, 5, 6 }
};

Console.WriteLine(matrix[1, 2]); // 6
```

For business applications, nested objects and collections are often more meaningful than multidimensional arrays, but arrays are useful for learning grids.

---

## Module F — Classes and objects

### 31. Classes — [02:25:23](https://www.youtube.com/watch?v=wxznTygnRfQ&t=8723s)

A class defines the data and behavior of a type.

```csharp
public class JobApplication
{
    public string Company { get; set; } = "";
    public string Position { get; set; } = "";

    public void Display()
    {
        Console.WriteLine($"{Position} at {Company}");
    }
}
```

### 32. Objects — [02:30:07](https://www.youtube.com/watch?v=wxznTygnRfQ&t=9007s)

A class is the definition; an object is a particular instance.

```csharp
JobApplication application = new();
application.Company = "Contoso";
application.Position = "Junior .NET Developer";
application.Display();
```

Two objects created from the same class can contain different state.

### 33. Constructors — [02:34:58](https://www.youtube.com/watch?v=wxznTygnRfQ&t=9298s)

A constructor establishes a valid initial object.

```csharp
public class JobApplication
{
    public JobApplication(string company, string position)
    {
        Company = company;
        Position = position;
    }

    public string Company { get; }
    public string Position { get; }
}
```

### 34. `static` — [02:40:41](https://www.youtube.com/watch?v=wxznTygnRfQ&t=9641s)

A static member belongs to the type itself rather than one object.

```csharp
public class ApplicationCounter
{
    public static int TotalCreated { get; private set; }

    public ApplicationCounter()
    {
        TotalCreated++;
    }
}
```

Do not make everything static. Instance members model the state and behavior of individual objects and are generally easier to test.

### 35. Overloaded constructors — [02:45:43](https://www.youtube.com/watch?v=wxznTygnRfQ&t=9943s)

```csharp
public JobApplication(string company, string position)
    : this(company, position, DateTime.Today)
{
}

public JobApplication(string company, string position, DateTime appliedOn)
{
    Company = company;
    Position = position;
    AppliedOn = appliedOn;
}
```

Constructor chaining avoids duplicated initialization.

### 36. Inheritance — [02:50:04](https://www.youtube.com/watch?v=wxznTygnRfQ&t=10204s)

Inheritance creates an “is-a” relationship.

```csharp
public class Employee
{
    public string Name { get; init; } = "";
}

public class Developer : Employee
{
    public string MainLanguage { get; init; } = "C#";
}
```

Prefer composition when the relationship is “has-a”. Do not create inheritance merely to reuse a few lines of code.

### 37. Abstract classes — [02:54:32](https://www.youtube.com/watch?v=wxznTygnRfQ&t=10472s)

An abstract class cannot be instantiated directly and can require derived classes to provide behavior.

```csharp
public abstract class Notification
{
    public abstract void Send(string message);
}
```

### 38. Arrays of objects — [02:57:08](https://www.youtube.com/watch?v=wxznTygnRfQ&t=10628s)

```csharp
JobApplication[] applications =
[
    new("Contoso", "Developer"),
    new("Fabrikam", "Intern")
];
```

An array stores references to objects. The array has a fixed length, but the objects can have different state.

### 39. Objects as arguments — [03:00:57](https://www.youtube.com/watch?v=wxznTygnRfQ&t=10857s)

```csharp
static void PrintApplication(JobApplication application)
{
    Console.WriteLine($"{application.Position} at {application.Company}");
}
```

Passing objects lets methods collaborate with domain types instead of long lists of unrelated primitive values.

**Checkpoint F:** build `Student`, `Course` and `Enrollment` classes. Create several objects and print a student’s enrolled courses.

---

## Module G — Object-oriented behavior

### 40. Method overriding — [03:05:15](https://www.youtube.com/watch?v=wxznTygnRfQ&t=11115s)

A derived class can replace a base class’s virtual behavior.

```csharp
public class Notification
{
    public virtual void Send() => Console.WriteLine("Sending notification");
}

public class EmailNotification : Notification
{
    public override void Send() => Console.WriteLine("Sending email");
}
```

### 41. `ToString` — [03:09:07](https://www.youtube.com/watch?v=wxznTygnRfQ&t=11347s)

Override `ToString` to provide a useful text representation.

```csharp
public override string ToString() => $"{Position} at {Company}";
```

Do not include secrets or sensitive personal information in representations that might be logged.

### 42. Polymorphism — [03:12:34](https://www.youtube.com/watch?v=wxznTygnRfQ&t=11554s)

Polymorphism allows one base type to represent several concrete implementations.

```csharp
Notification[] notifications =
[
    new EmailNotification(),
    new SmsNotification()
];

foreach (Notification notification in notifications)
{
    notification.Send();
}
```

The correct overridden method runs based on the actual object.

### 43. Interfaces — [03:17:44](https://www.youtube.com/watch?v=wxznTygnRfQ&t=11864s)

An interface defines a capability or contract.

```csharp
public interface INotificationSender
{
    Task SendAsync(string message, CancellationToken cancellationToken);
}
```

A class can implement multiple interfaces. Interfaces are important in ASP.NET Core dependency injection and testing.

**Checkpoint G:** implement `INotificationSender` with console and fake-email implementations, then select one in `Program.cs`.

---

## Module H — Collections, properties and advanced fundamentals

### 44. Lists — [03:23:22](https://www.youtube.com/watch?v=wxznTygnRfQ&t=12202s)

`List<T>` is a resizable ordered collection.

```csharp
List<string> skills = ["C#", "SQL"];
skills.Add("Git");
skills.Remove("SQL");

foreach (string skill in skills)
{
    Console.WriteLine(skill);
}
```

Use arrays for fixed-size data and lists for collections that grow or shrink.

### 45. Lists of objects — [03:30:07](https://www.youtube.com/watch?v=wxznTygnRfQ&t=12607s)

```csharp
List<JobApplication> applications =
[
    new("Contoso", "Developer"),
    new("Fabrikam", "Intern")
];

applications.Add(new JobApplication("Northwind", "Junior Engineer"));
```

This pattern appears constantly in business applications and database results.

### 46. Getters and setters — [03:33:35](https://www.youtube.com/watch?v=wxznTygnRfQ&t=12815s)

Properties control access to data and can enforce rules.

```csharp
private decimal _salary;

public decimal Salary
{
    get => _salary;
    set
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(value));
        }

        _salary = value;
    }
}
```

### 47. Auto-implemented properties — [03:37:41](https://www.youtube.com/watch?v=wxznTygnRfQ&t=13061s)

Use an auto-property when no custom accessor logic is required.

```csharp
public string Company { get; set; } = "";
public DateTime AppliedOn { get; init; }
public Guid Id { get; private set; } = Guid.NewGuid();
```

- `set` allows later assignment.
- `init` allows assignment only during initialization.
- `private set` lets only the class change the property after creation.

### 48. Enums — [03:40:26](https://www.youtube.com/watch?v=wxznTygnRfQ&t=13226s)

An enum gives names to a finite set of choices.

```csharp
public enum ApplicationStatus
{
    Draft,
    Applied,
    Interview,
    Offer,
    Rejected
}
```

Enums make code clearer than unexplained integers or inconsistent strings.

### 49. Generics — [03:47:33](https://www.youtube.com/watch?v=wxznTygnRfQ&t=13653s)

Generics let code work safely with different types.

```csharp
static T FirstOrThrow<T>(IReadOnlyList<T> items)
{
    if (items.Count == 0)
    {
        throw new InvalidOperationException("The collection is empty.");
    }

    return items[0];
}
```

You already use generics in `List<string>`, `List<JobApplication>` and later `Task<T>` and `DbSet<T>`.

### 50. Multithreading — [03:52:56](https://www.youtube.com/watch?v=wxznTygnRfQ&t=13976s)

A process can use multiple threads to perform work concurrently. Shared mutable data creates risks such as race conditions.

For a beginner backend developer, learn the distinction:

- **Concurrency:** tasks make progress during overlapping time.
- **Parallelism:** work literally runs at the same time on multiple cores.
- **Asynchronous I/O:** a thread is not blocked while waiting for a file, database or network response.

The video’s direct thread example is useful background, but modern ASP.NET Core code usually relies on `Task`, `async` and `await` for I/O. Do not create a new thread for each web request.

```csharp
static async Task<string> LoadPageAsync(HttpClient client, string url)
{
    return await client.GetStringAsync(url);
}
```

**Final video checkpoint:** build a console-based job application tracker with classes, a `List<JobApplication>`, an enum for status, input validation, methods for CRUD operations and basic reports.

---

# Part 3 — What the video covers and what it does not

## Covered well enough for a first pass

- Basic C# syntax
- Variables and primitive types
- Console input and output
- Conditions and loops
- Arrays and lists
- Methods
- Exceptions
- Classes and objects
- Constructors and properties
- Inheritance, abstraction, polymorphism and interfaces
- Generics and introductory threading

## Still required for a .NET backend job

- Git and GitHub workflow
- Debugging and clean code
- LINQ
- Asynchronous programming in depth
- Unit and integration testing
- Relational databases and SQL
- Entity Framework Core
- HTTP and REST
- ASP.NET Core Web APIs
- Dependency injection and middleware
- Authentication and authorization
- Logging and configuration
- Docker
- Continuous integration and deployment
- Portfolio, CV, interviews and applications

---

# Part 4 — Complete start-to-finish roadmap

Do not advance based only on time. Advance when you pass the phase’s completion test.

## Phase 0 — Setup and Git: Week 1

### Learn

- Install .NET 10, Visual Studio and Git.
- Create, run and debug a console project.
- Learn `git status`, `git add`, `git commit`, `git log`, `git switch` and `git push`.
- Create a GitHub repository.

### Deliverable

A `csharp-learning` repository containing one working console project and at least five meaningful commits.

### Completion test

Create a new project, add a small feature, debug it, commit it and push it without following instructions.

## Phase 1 — Video and C# foundations: Weeks 2–5

### Week 2

Study chapters 1–17: output, values, input, arithmetic, strings, decisions and loops.

Build:

- Grade calculator
- Unit converter
- Repeating console menu

### Week 3

Study chapters 18–30: three projects, arrays, methods, errors and concise syntax.

Build one improved game and a calculator with validation and separate methods.

### Week 4

Study chapters 31–43: classes, objects and object-oriented behavior.

Build a library model containing books, members and loans.

### Week 5

Study chapters 44–50, then build the console Job Application Tracker without replaying the tutorial.

### Completion test

The tracker must:

- Add, edit, list and delete applications
- Use several collaborating classes
- Store applications in a list
- Use an enum for status
- Validate input
- Search and filter applications
- Save and load JSON
- Handle expected failures without crashing

## Phase 2 — Professional C#: Weeks 6–10

### Weeks 6–7: deeper C#

Learn:

- Nullable reference types
- Records
- Generics
- Delegates and lambdas
- LINQ
- Collection choices
- File and JSON operations

Resource: [LINQ introduction](https://learn.microsoft.com/en-us/dotnet/csharp/linq/get-started/introduction-to-linq-queries)

Add LINQ reports to the tracker:

- Applications per status
- Applications per month
- Companies ordered by application count
- Upcoming interviews

### Week 8: asynchronous programming

Learn `Task`, `Task<T>`, `async`, `await`, cancellation and asynchronous exception handling.

Resource: [Asynchronous programming](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/)

Call a public HTTP API and save its response asynchronously.

### Weeks 9–10: clean design and tests

Learn:

- Separation of concerns
- Composition
- SOLID as practical guidance
- Dependency injection
- xUnit
- Arrange–Act–Assert
- Unit tests versus integration tests

Resources:

- [.NET dependency injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/usage)
- [Unit testing practices](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)

Refactor business logic away from console input/output and test it.

### Completion test

Explain and demonstrate LINQ, `async`/`await`, interfaces, dependency injection and isolated unit tests.

## Phase 3 — SQL and EF Core: Weeks 11–15

### Weeks 11–13: SQL

Learn:

- Tables, keys and relationships
- `SELECT`, `INSERT`, `UPDATE` and `DELETE`
- Filtering and ordering
- Joins
- Grouping and aggregates
- Constraints
- Normalization
- Transactions
- Index fundamentals

Resource: [Microsoft T-SQL tutorial](https://learn.microsoft.com/en-us/sql/t-sql/tutorial-writing-transact-sql-statements)

Design an inventory database with products, categories, warehouses, suppliers and stock movements.

### Weeks 14–15: Entity Framework Core

Learn:

- `DbContext` and `DbSet<T>`
- Entity relationships
- Migrations
- LINQ translated to SQL
- Tracking and no-tracking queries
- Eager loading
- Transactions
- N+1 query problems

Resource: [Entity Framework Core documentation](https://learn.microsoft.com/en-us/ef/core/)

### Completion test

Create the schema, write a join manually, create and apply migrations, query related data and inspect EF Core’s generated SQL.

## Phase 4 — ASP.NET Core APIs: Weeks 16–21

### Week 16: web fundamentals

Learn HTTP methods, URLs, headers, JSON, status codes and REST resource design.

### Weeks 17–19: API fundamentals

Learn:

- ASP.NET Core project structure
- Controllers and routing
- Model binding
- DTOs
- Validation
- Dependency injection lifetimes
- Middleware
- Configuration and environments
- Structured logging
- Global error handling
- OpenAPI

Resources:

- [ASP.NET Core beginner path](https://learn.microsoft.com/en-us/training/paths/aspnet-core-web-app/)
- [ASP.NET Core fundamentals](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/?view=aspnetcore-10.0)
- [Web API tutorial](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0)

### Weeks 20–21: useful API behavior

Add pagination, filtering, sorting, cancellation, consistent errors and correct status codes.

### Deliverable

Turn the inventory system into an ASP.NET Core REST API backed by a relational database.

### Completion test

Trace and explain a request through middleware, controller, service, EF Core, database and response. Justify every important HTTP status code.

**Start applying for internships and suitable junior roles now.** Do not wait for the roadmap to be perfect.

## Phase 5 — Testing and security: Weeks 22–25

### Learn

- Unit tests for business rules
- Integration tests for endpoints
- Authentication versus authorization
- Claims, roles and policies
- Resource ownership
- Password and secret handling
- CORS
- Common web vulnerabilities
- Health checks and structured logging

Resource: [ASP.NET Core security](https://learn.microsoft.com/en-us/aspnet/core/security/?view=aspnetcore-10.0)

### Completion test

- Tests run automatically and cover important behavior.
- A normal user cannot access admin operations.
- One user cannot modify another user’s data.
- No passwords, connection strings or secrets are committed.

## Phase 6 — Docker, CI and deployment: Weeks 26–29

### Week 26: Docker

Learn images, containers, Dockerfiles, ports, environment variables, volumes, networks and Docker Compose.

Resource: [.NET container tutorial](https://learn.microsoft.com/en-us/dotnet/core/docker/build-container)

### Week 27: continuous integration

Create a GitHub Actions workflow that restores, builds and tests every pull request.

Resource: [Building and testing .NET with GitHub Actions](https://docs.github.com/en/actions/tutorials/build-and-test-code/net)

### Weeks 28–29: deployment

Deploy the API and database. Configure HTTPS, production settings, secrets, logs and a health endpoint.

Resource: [Deploy ASP.NET Core to Azure](https://learn.microsoft.com/en-us/azure/app-service/quickstart-dotnetcore)

### Completion test

A reviewer can clone the repository, run the API and database from documented commands, execute tests and visit a live deployment.

## Phase 7 — Flagship portfolio: Weeks 30–34

Rebuild the Job Application Tracker as a full backend application.

Required domain:

```text
User
Company
Vacancy
Application
Interview
Note
Contact
ApplicationStatus
```

Required features:

- Registration and login
- User and administrator authorization
- CRUD operations
- Ownership rules
- Search, filtering, sorting and pagination
- Dashboard statistics
- SQL database and EF Core migrations
- OpenAPI documentation
- Unit and integration tests
- Docker Compose
- GitHub Actions
- Cloud deployment

The README must explain the problem, setup, architecture, data model, API, tests, important decisions, compromises and future work.

Optional frontend: use one of Razor Pages, Blazor, React or Angular. Keep it modest because the target job is backend development.

### Completion test

A recruiter can understand the project in five minutes, start it from the README, see passing CI, test the live application and find no copied tutorial architecture or unexplained technology.

## Phase 8 — Interviews and job search: Weeks 35–38 and ongoing

### Technical review

Prepare to explain:

- Value versus reference types
- Class versus record
- Interface versus abstract class
- Composition versus inheritance
- Collections and generics
- LINQ and deferred execution
- `async`/`await`
- Exceptions
- Dependency injection lifetimes
- HTTP and REST
- SQL joins, transactions and indexes
- EF Core tracking, relationships and migrations
- Unit versus integration tests
- Authentication versus authorization
- Docker and CI/CD

### Practical interview work

Practice:

- Small string, array, dictionary and LINQ problems
- A SQL join and grouped report
- Designing a CRUD endpoint
- Diagnosing a failing API request
- Writing two business-rule tests
- Reviewing a small pull request
- Explaining a difficult bug from your project

### Weekly job-search targets

- 8–12 tailored applications
- 10 advertisements analysed for skill patterns
- Two professional networking messages
- One mock interview
- One measurable portfolio improvement
- Follow-ups recorded in your tracker

Apply when you satisfy roughly 60–70% of a junior advertisement. Treat internship, graduate, junior C# and Software Engineer I titles as relevant.

---

# Part 5 — Your exact first week

## Day 1

1. Install .NET 10, Visual Studio and Git.
2. Run `dotnet --version` and `git --version`.
3. Create and run `FirstProgram`.
4. Place a breakpoint on `Console.WriteLine`.

## Day 2

1. Watch chapters 1–5.
2. Type every example.
3. Complete the profile-printing and job-advertisement exercises.

## Day 3

1. Watch chapters 6–10.
2. Build the rectangle calculator.
3. Validate all user input with `TryParse`.

## Day 4

1. Learn basic Git commands.
2. Create your GitHub repository.
3. Push your work.
4. Make at least three small, meaningful commits.

## Day 5

1. Rebuild the rectangle calculator from a blank project.
2. Add area, perimeter and diagonal.
3. Handle missing, invalid and negative input.

## Day 6

1. Review your mistakes.
2. Write short notes in your own words.
3. Improve names and remove duplicated code.

## Day 7

Without notes, explain variables, constants, conversions, input, arithmetic and methods. If you cannot explain a concept or rebuild the program, repeat the relevant chapter before continuing.

---

# Part 6 — Final job-readiness checklist

You are ready for serious junior interviews when you can check all of these:

- [ ] I can build an ASP.NET Core API without following a tutorial.
- [ ] I can design and query a small relational database.
- [ ] I can write joins and grouped SQL queries.
- [ ] I can use EF Core relationships and migrations.
- [ ] I can explain LINQ and asynchronous programming.
- [ ] I can use dependency injection appropriately.
- [ ] I can write meaningful unit and integration tests.
- [ ] I can authenticate users and enforce authorization rules.
- [ ] I can use Git branches, commits and pull requests.
- [ ] I can containerize an application.
- [ ] I can configure continuous integration.
- [ ] I can deploy and diagnose an API.
- [ ] I can explain every major decision in my flagship project.
- [ ] I have two polished repositories and one live application.
- [ ] I am applying consistently and tracking the results.

## Final principle

Do not measure progress by hours of video watched. Measure it by software you can build, explain, test, debug and deploy without copying.
