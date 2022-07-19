export default interface AsyncState<T> {
    data: T | undefined;
    error: any;
    loading: boolean;
}
