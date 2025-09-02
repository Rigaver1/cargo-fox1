#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Tkinter GUI launcher to start/stop the frontend (Vite dev server).

- Start: runs frontend/start.bat (or `npm run dev` if missing)
- Stop: runs frontend/stop.bat (or kills listeners on :5173 if missing)

Keep existing project files intact. Import/run as `python -m lib.frontend_gui`.
"""

from __future__ import annotations

import os
import socket
import subprocess
import threading
import time
import webbrowser
from pathlib import Path

try:
    import tkinter as tk
    from tkinter import messagebox
except Exception as e:  # pragma: no cover
    raise RuntimeError("Tkinter is required to run the frontend GUI") from e


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
START_BAT = FRONTEND_DIR / "start.bat"
STOP_BAT = FRONTEND_DIR / "stop.bat"
FRONTEND_URL = "http://localhost:5173"


def _createflags_no_window() -> int:
    # On Windows, hide the extra shell window for helper scripts
    if os.name == "nt":
        CREATE_NO_WINDOW = 0x08000000  # from Windows API
        return CREATE_NO_WINDOW
    return 0


def is_frontend_running(host: str = "127.0.0.1", port: int = 5173, timeout: float = 0.2) -> bool:
    s = socket.socket()
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        return True
    except OSError:
        return False
    finally:
        try:
            s.close()
        except Exception:
            pass


def _run_detached(cmd, cwd: Path | None = None) -> subprocess.Popen:
    creationflags = _createflags_no_window()
    if isinstance(cmd, str):
        return subprocess.Popen(cmd, cwd=str(cwd) if cwd else None, shell=True, creationflags=creationflags)
    return subprocess.Popen(cmd, cwd=str(cwd) if cwd else None, shell=False, creationflags=creationflags)


def start_frontend(callback: callable | None = None) -> None:
    """Start frontend dev server in background thread."""
    def _task():
        try:
            if START_BAT.exists():
                _run_detached(["cmd", "/c", str(START_BAT)], cwd=FRONTEND_DIR)
            else:
                # Fallback: run `npm run dev` directly
                _run_detached(["cmd", "/c", "npm install && npm run dev"], cwd=FRONTEND_DIR)
            # Give it a moment to boot before status checks
            time.sleep(0.5)
        except Exception as e:
            messagebox.showerror("Ошибка запуска", f"Не удалось запустить frontend.\n\n{e}")
        finally:
            if callback:
                callback()

    threading.Thread(target=_task, daemon=True).start()


def stop_frontend(callback: callable | None = None) -> None:
    """Stop frontend dev server in background thread."""
    def _task():
        try:
            if STOP_BAT.exists():
                _run_detached(["cmd", "/c", str(STOP_BAT)], cwd=FRONTEND_DIR)
            else:
                # Fallback: free port 5173 by killing listeners (cmd.exe one-liner)
                kill_cmd = 'for /f "tokens=5" %P in (\'netstat -ano ^| findstr /R /C:":5173.*LISTENING"\') do taskkill /F /PID %P'
                _run_detached(["cmd", "/c", kill_cmd], cwd=BASE_DIR)
            time.sleep(0.3)
        except Exception as e:
            messagebox.showerror("Ошибка остановки", f"Не удалось остановить frontend.\n\n{e}")
        finally:
            if callback:
                callback()

    threading.Thread(target=_task, daemon=True).start()


class FrontendGUI(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Cargo Manager — Frontend")
        self.geometry("420x200")
        self.resizable(False, False)

        # Menu
        menubar = tk.Menu(self)
        actions = tk.Menu(menubar, tearoff=0)
        actions.add_command(label="Запустить", command=self._on_start)
        actions.add_command(label="Остановить", command=self._on_stop)
        actions.add_separator()
        actions.add_command(label="Открыть в браузере", command=lambda: webbrowser.open(FRONTEND_URL))
        actions.add_separator()
        actions.add_command(label="Выход", command=self.destroy)
        menubar.add_cascade(label="Действия", menu=actions)
        self.config(menu=menubar)

        # Body
        self.status_var = tk.StringVar(self, value="Статус: проверка…")

        lbl = tk.Label(self, textvariable=self.status_var, anchor="w")
        lbl.pack(fill="x", padx=14, pady=(16, 10))

        btns = tk.Frame(self)
        btns.pack(fill="x", padx=12, pady=4)

        self.start_btn = tk.Button(btns, text="Запустить Frontend", width=24, command=self._on_start)
        self.stop_btn = tk.Button(btns, text="Остановить Frontend", width=24, command=self._on_stop)
        self.open_btn = tk.Button(btns, text="Открыть http://localhost:5173", command=lambda: webbrowser.open(FRONTEND_URL))

        self.start_btn.grid(row=0, column=0, padx=6, pady=6)
        self.stop_btn.grid(row=0, column=1, padx=6, pady=6)
        self.open_btn.grid(row=1, column=0, columnspan=2, padx=6, pady=(4, 6))

        self._refresh_status()

    # UI helpers
    def _set_busy(self, busy: bool) -> None:
        self.start_btn.config(state=("disabled" if busy else "normal"))
        self.stop_btn.config(state=("disabled" if busy else "normal"))

    def _refresh_status(self) -> None:
        running = is_frontend_running()
        self.status_var.set("Статус: запущен" if running else "Статус: остановлен")
        self.start_btn.config(state=("disabled" if running else "normal"))
        self.stop_btn.config(state=("normal" if running else "disabled"))
        # Schedule next poll
        self.after(1000, self._refresh_status)

    # Actions
    def _on_start(self) -> None:
        self._set_busy(True)
        start_frontend(callback=lambda: self._set_busy(False))

    def _on_stop(self) -> None:
        self._set_busy(True)
        stop_frontend(callback=lambda: self._set_busy(False))


def run() -> None:
    if not FRONTEND_DIR.exists():
        messagebox.showerror(
            "Frontend не найден",
            f"Каталог frontend отсутствует:\n{FRONTEND_DIR}\n\nПроверьте структуру проекта.",
        )
        return
    app = FrontendGUI()
    app.mainloop()


if __name__ == "__main__":  # pragma: no cover
    run()

