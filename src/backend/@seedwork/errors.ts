import { NextResponse } from "next/server";
import { FieldsErrors } from "./validator";

export class DuplicatedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DuplicatedError";
    }
}

export class InvalidUuidError extends Error {
    constructor(message?: string) {
        super(message || "ID must be a valid UUID");
        this.name = "InvalidUuidError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class EntityValidationError extends Error {
    constructor(public error: FieldsErrors = {}, message = "Validation Error") {
        // constructor(message: string) {
        super(message);
        this.name = "EntityValidationError";
    }
}

export function errorHandling(e: unknown): NextResponse {
    if (e instanceof NotFoundError) {
        return NextResponse.json(e.message, { status: 404 })
    }

    if (e instanceof EntityValidationError) {
        return NextResponse.json({ message: e.message, error: e.error }, { status: 422 })
    }

    if (e instanceof InvalidUuidError) {
        return NextResponse.json(e.message, { status: 422 })
    }

    if (e instanceof DuplicatedError) {
        return NextResponse.json(e.message, { status: 422 })
    }

    return NextResponse.json(JSON.stringify(e), { status: 500 })
}