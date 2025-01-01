import { toDateString, toLastUpdateTime } from "../../../src/price-generator/date-time-formatter";

describe("date-time-formatter", () => {
    describe("toDateString", () => {
        test("should convert date to string with daylight saving", () => {
            expect(toDateString(new Date("2023-07-20T10:00:00Z"))).toEqual("20/07");
            expect(toDateString(new Date("2023-07-20T23:00:00Z"))).toEqual("21/07");
        });

        test("should convert date to string without daylight saving", () => {
            expect(toDateString(new Date("2023-10-31T10:00:00Z"))).toEqual("31/10");
            expect(toDateString(new Date("2023-10-31T23:00:00Z"))).toEqual("31/10");
        });
    });

    describe("toLastUpdateTime", () => {
        test("should return with date and time with daylight saving", () => {
            expect(toLastUpdateTime(new Date("2023-07-20T10:10:00Z"))).toEqual("20/07, 11:10");
            expect(toLastUpdateTime(new Date("2023-07-20T23:20:00Z"))).toEqual("21/07, 00:20");
        });

        test("should return with date and time without daylight saving", () => {
            expect(toLastUpdateTime(new Date("2023-10-31T10:10:00Z"))).toEqual("31/10, 10:10");
            expect(toLastUpdateTime(new Date("2023-10-31T23:20:00Z"))).toEqual("31/10, 23:20");
        });
    });
});
