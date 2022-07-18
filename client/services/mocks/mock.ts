export default function mockFetch<Тype>(delay: number, data: Тype): Promise<Тype> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(data);
        }, delay);
    });
}
