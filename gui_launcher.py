import tkinter as tk
import os
import threading

def start_program():
    threading.Thread(target=lambda: os.startfile('start_cargo_os.bat'), daemon=True).start()

def stop_program():
    threading.Thread(target=lambda: os.startfile('stop_cargo_os.bat'), daemon=True).start()

root = tk.Tk()
root.title("Управление Cargo Manager")

start_btn = tk.Button(root, text="Запустить", command=start_program, height=2, width=20)
start_btn.pack(pady=10)

stop_btn = tk.Button(root, text="Остановить", command=stop_program, height=2, width=20)
stop_btn.pack(pady=10)

root.mainloop()
