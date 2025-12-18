import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { describe, it, expect, vi } from "vitest";

// ✅ Mock Axios (Prevents network crashes)
vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({}),
  },
}));

describe("Dashboard Component", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // 🔍 DEBUG: This prints your actual Dashboard HTML to the terminal
    // So you can see what text is actually there!
    screen.debug();

    // ✅ PROOF: Check that the page is not empty
    expect(container).not.toBeEmptyDOMElement();
  });
});