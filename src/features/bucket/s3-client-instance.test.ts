import { describe, expect, it } from "@jest/globals";

import { s3ClientInstance } from "./s3-client-instance";

describe("S3 Client Instance", () => {
  it("should create a new S3 client instance", () => {
    const client = s3ClientInstance();
    expect(client).toBeDefined();
  });

  it("should return the same instance on subsequent calls", () => {
    const client1 = s3ClientInstance();
    const client2 = s3ClientInstance();
    expect(client1).toBe(client2);
  });
});
