type TupleExpansion<T, N extends number, R extends T[]> = R['length'] extends N
  ? R
  : TupleExpansion<T, N, [T, ...R]>;
export type Tuple<T, N extends number> = number extends N ? T[] : TupleExpansion<T, N, []>;

export type Bool = 0 | 1;

interface GateFunction<
  I extends (Bool | Tuple<Bool, number>)[],
  O extends Bool | Tuple<Bool | Tuple<Bool, number>, number>
> {
  (...args: I): O;
}

export interface WithGateCounts<
  I extends (Bool | Tuple<Bool, number>)[],
  O extends Bool | Tuple<Bool | Tuple<Bool, number>, number>
> extends GateFunction<I, O> {
  gateCounts: { [gate: string]: number };
}
