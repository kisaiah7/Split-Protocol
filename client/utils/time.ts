export function formatTimeType(value: number, type: string): string {
    if (value == 0) return '';
    if (Math.abs(value) == 1) return `  • ${Math.abs(value)} ${type}`;
    return `${Math.abs(value)} ${type}s`;
}

export function calculateTimeDiff(expenseDue: Date): string {
    const currentTime = new Date();
    if (expenseDue.getTime() < currentTime.getTime()) return 'now';
    const timeDiff = expenseDue.getTime() - currentTime.getTime();
    let time = timeDiff;
    const days = Math.ceil(time / (1000 * 3600 * 24));
    const hours = Math.ceil(time / 1000 / 60 / 60);
    time -= hours * 1000 * 60 * 60;
    const minutes = Math.ceil(time / 1000 / 60);
    time -= minutes * 1000 * 60;
    const seconds = Math.ceil(time / 1000);
    time -= seconds * 1000;
    if (days != 0) return `${formatTimeType(days, 'day')}`;
    if (hours != 0) return `${formatTimeType(hours, 'hour')}`;
    if (minutes != 0) return `${formatTimeType(minutes, 'minute')}`;
    if (seconds != 0) return `${formatTimeType(seconds, 'second')}`;
    return 'now';
}