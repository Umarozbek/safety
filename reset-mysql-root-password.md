# Reset MySQL root password (run in an Administrator PowerShell)

1. Stop the service:
   ```powershell
   Stop-Service -Name MySQL80 -Force
   ```

2. Create an init file with the new password (edit the password below first):
   ```powershell
   $initFile = "$env:TEMP\mysql-init.txt"
   'ALTER USER ''root''@''localhost'' IDENTIFIED BY ''DevPassword123!'';' | Out-File -FilePath $initFile -Encoding ascii
   ```

3. Start mysqld manually with the init file (this runs in the foreground — open a **second** admin PowerShell window for step 4, or background it):
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --init-file="$env:TEMP\mysql-init.txt" --console
   ```

4. In a second admin window, once you see it's up and idle, stop it with Ctrl+C in the first window, then:
   ```powershell
   Start-Service -Name MySQL80
   ```

5. Verify:
   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p"DevPassword123!" -e "SELECT 1;"
   ```

Once this works, tell Claude the password you set (e.g. `DevPassword123!`) so it can update `backend/.env`.
