import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import { describe, it, expect } from "vitest";

describe("Login Component", () => {
  it("renders the login form correctly", () => {
    // 1. Render the Login Page
    const { container } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 2. Check for Email Input (Find by type="email")
    // This works regardless of what the placeholder text says!
    const emailInput = container.querySelector('input[type="email"]');
    expect(emailInput).toBeInTheDocument();

    // 3. Check for Password Input (Find by type="password")
    const passwordInput = container.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    // 4. Check for the Login Button
    // Looks for any button with "Login" or "Sign In" text
    const loginButton = screen.queryByRole("button", { name: /login/i }) || screen.queryByRole("button", { name: /sign in/i });
    expect(loginButton).toBeInTheDocument();
  });
});