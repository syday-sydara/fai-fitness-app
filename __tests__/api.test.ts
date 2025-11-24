import { createMocks } from "node-mocks-http";
import * as workoutsRoute from "../app/api/workouts/route";
import * as weightRoute from "../app/api/weight/route";

describe("API Routes", () => {
  it("logs a workout", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { userId: "alex123", exercise: "Pushups", duration: 20, intensity: "medium", date: new Date() },
    });

    const response = await workoutsRoute.POST(req);
    expect(response.status).toBe(200);
  });

  it("logs a weight", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { userId: "alex123", value: 75, date: new Date() },
    });

    const response = await weightRoute.POST(req);
    expect(response.status).toBe(200);
  });
});