/**
 * Executes callback once after the first pause of events for over {delay} milliseconds
 * or after the last execution finished, whichever takes longer.
 */
export function promiseDebounce<C extends (...args: unknown[]) => Promise<unknown>>(
    callback: C,
    delay: number,
): (...args: Parameters<C>) => void {
    let timeout: NodeJS.Timeout;
    let timeoutReject: () => void;
    let last: Promise<unknown>;

    return (...args: Parameters<C>): void => {
        if (timeout) {
            clearTimeout(timeout);
        }

        if (timeoutReject) {
            timeoutReject();
        }

        Promise.all([
            new Promise((resolve, reject) => {
                timeout = setTimeout(resolve, delay);
                timeoutReject = reject;
            }),
            last,
        ])
            .then(() => {
                timeout = undefined;
                timeoutReject = undefined;
                last = callback(...args);
            })
            .catch(() => {
                /* empty */
            });
    };
}
