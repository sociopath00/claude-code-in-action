import { test, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallBadge, getLabel } from "../ToolCallBadge";

describe("getLabel", () => {
  test("str_replace_editor create", () => {
    expect(getLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating /App.jsx");
  });

  test("str_replace_editor str_replace", () => {
    expect(getLabel("str_replace_editor", { command: "str_replace", path: "/App.jsx" })).toBe("Editing /App.jsx");
  });

  test("str_replace_editor insert", () => {
    expect(getLabel("str_replace_editor", { command: "insert", path: "/App.jsx" })).toBe("Editing /App.jsx");
  });

  test("str_replace_editor view", () => {
    expect(getLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Reading /App.jsx");
  });

  test("str_replace_editor undo_edit", () => {
    expect(getLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Undoing edit on /App.jsx");
  });

  test("file_manager rename", () => {
    expect(getLabel("file_manager", { command: "rename", path: "/old.jsx" })).toBe("Renaming /old.jsx");
  });

  test("file_manager delete", () => {
    expect(getLabel("file_manager", { command: "delete", path: "/old.jsx" })).toBe("Deleting /old.jsx");
  });

  test("unknown tool falls back to tool name", () => {
    expect(getLabel("some_other_tool", {})).toBe("some_other_tool");
  });
});

describe("ToolCallBadge", () => {
  test("shows label when complete", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="result"
        result="ok"
      />
    );
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
  });

  test("shows green dot when state is result with result", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="result"
        result="ok"
      />
    );
    expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
    expect(container.querySelector(".animate-spin")).toBeNull();
  });

  test("shows spinner when state is call", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="call"
      />
    );
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  test("shows spinner when state is partial-call", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="partial-call"
      />
    );
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  test("shows spinner when result is undefined even if state is result", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="result"
      />
    );
    expect(container.querySelector(".animate-spin")).not.toBeNull();
    expect(container.querySelector(".bg-emerald-500")).toBeNull();
  });

  test("falls back to tool name for unknown tool", () => {
    render(
      <ToolCallBadge
        toolName="unknown_tool"
        args={{}}
        state="result"
        result="ok"
      />
    );
    expect(screen.getByText("unknown_tool")).toBeDefined();
  });
});
