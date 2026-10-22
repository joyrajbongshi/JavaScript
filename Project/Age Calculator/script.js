
const ageForm = document.getElementById("ageForm");
const birthDateInput = document.getElementById("birthDate");
const message = document.getElementById("message");
const results = document.getElementById("results");

const resetBtn = document.getElementById("resetBtn");
const copyBtn = document.getElementById("copyBtn");

const output = {
    years: document.getElementById("years"),
    months: document.getElementById("months"),
    days: document.getElementById("days"),
    birthdayTitle: document.getElementById("birthdayTitle"),
    birthdayDate: document.getElementById("birthdayDate"),
    birthdayDays: document.getElementById("birthdayDays"),
    birthdayLabel: document.getElementById("birthdayLabel"),
    totalDays: document.getElementById("totalDays"),
    totalWeeks: document.getElementById("totalWeeks"),
    birthWeekday: document.getElementById("birthWeekday"),
    milestone: document.getElementById("milestone"),
    milestoneDate: document.getElementById("milestoneDate")
};

const DAY_MS = 24 * 60 * 60 * 1000;

const formatter = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
});

const weekdayFormatter = new Intl.DateTimeFormat("en", {
    weekday: "long",
    timeZone: "UTC"
});

function localDateToUTC(date) {
    return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

function todayLocal() {
    const now = new Date();

    return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
}

function formatInputDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseBirthDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

function createBirthday(year, birthMonth, birthDay) {
    const lastDay = new Date(year, birthMonth, 0).getDate();

    return new Date(
        year,
        birthMonth - 1,
        Math.min(birthDay, lastDay)
    );
}

function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
}

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = `message ${type}`.trim();
}

function getAge(birth, today) {
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
        months--;

        const daysInPreviousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();

        days += daysInPreviousMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function calculateBirthday(birth, today) {
    const birthMonth = birth.getMonth() + 1;
    const birthDay = birth.getDate();

    let nextBirthday = createBirthday(
        today.getFullYear(),
        birthMonth,
        birthDay
    );

    if (localDateToUTC(nextBirthday) < localDateToUTC(today)) {
        nextBirthday = createBirthday(
            today.getFullYear() + 1,
            birthMonth,
            birthDay
        );
    }

    const daysUntil = Math.round(
        (localDateToUTC(nextBirthday) - localDateToUTC(today)) / DAY_MS
    );

    return { nextBirthday, daysUntil };
}

function calculateAge() {
    const birth = parseBirthDate(birthDateInput.value);
    const today = todayLocal();

    if (!birthDateInput.value) {
        results.hidden = true;
        showMessage("Please select your date of birth.", "error");
        birthDateInput.focus();
        return;
    }

    if (!birth || localDateToUTC(birth) > localDateToUTC(today)) {
        results.hidden = true;
        showMessage("Please enter a valid date that is not in the future.", "error");
        return;
    }

    const age = getAge(birth, today);
    const totalDays = Math.round(
        (localDateToUTC(today) - localDateToUTC(birth)) / DAY_MS
    );

    const { nextBirthday, daysUntil } = calculateBirthday(birth, today);

    output.years.textContent = formatNumber(age.years);
    output.months.textContent = formatNumber(age.months);
    output.days.textContent = formatNumber(age.days);

    output.totalDays.textContent = formatNumber(totalDays);
    output.totalWeeks.textContent = formatNumber(Math.floor(totalDays / 7));

    output.birthWeekday.textContent = weekdayFormatter.format(birth);

    output.birthdayDate.textContent = formatter.format(nextBirthday);
    output.birthdayDays.textContent = formatNumber(daysUntil);

    if (daysUntil === 0) {
        output.birthdayTitle.textContent = "Happy birthday!";
        output.birthdayLabel.textContent = "today!";
    } else {
        output.birthdayTitle.textContent = "Your next birthday";
        output.birthdayLabel.textContent =
            daysUntil === 1 ? "day to go" : "days to go";
    }

    const nextAge = age.years + 1;
    const milestoneDate = createBirthday(
        birth.getFullYear() + nextAge,
        birth.getMonth() + 1,
        birth.getDate()
    );

    output.milestone.textContent = `${nextAge} years`;
    output.milestoneDate.textContent = formatter.format(milestoneDate);

    results.hidden = false;
    showMessage("Your age has been calculated successfully.", "success");
}

ageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    calculateAge();
});

resetBtn.addEventListener("click", function () {
    ageForm.reset();
    results.hidden = true;

    showMessage("Your date stays in your browser. No account needed.");
    birthDateInput.focus();
});

copyBtn.addEventListener("click", async function () {
    const text = [
        "AgeWise — My Age Results",
        `Age: ${output.years.textContent} years, ${output.months.textContent} months, ${output.days.textContent} days`,
        `Total days lived: ${output.totalDays.textContent}`,
        `Total weeks lived: ${output.totalWeeks.textContent}`,
        `Born on: ${output.birthWeekday.textContent}`,
        `Next birthday: ${output.birthdayDate.textContent}`,
        `Birthday countdown: ${output.birthdayDays.textContent} ${output.birthdayLabel.textContent}`
    ].join("\n");

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Copied!";
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        textarea.remove();

        copyBtn.textContent = copied ? "Copied!" : "Copy unavailable";
    }

    setTimeout(() => {
        copyBtn.textContent = "Copy results";
    }, 2000);
});

birthDateInput.max = formatInputDate(todayLocal());
