export type StandardUnitRates = {
    count: number,
    results: Result[],
}

export type Result = {
    value_exc_vat: number,
    value_inc_vat: number,
    valid_from: string,
    valid_to: string,
}