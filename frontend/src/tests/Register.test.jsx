import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import { describe, it, expect } from "vitest";

describe("Register Component", () => {
  it("renders the registration form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    // 1. Check Name Input (by placeholder)
    expect(screen.getByPlaceholderText(/John Doe/i)).toBeInTheDocument();

    // 2. Check Email Input (by placeholder)
    expect(screen.getByPlaceholderText(/john@example.com/i)).toBeInTheDocument();
    
    // 3. Check Password Input (by placeholder "••••••••")
    // This fixes the "Label not associated" error
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    
    // 4. Check Register Button
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });
});