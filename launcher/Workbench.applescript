on isProject(folderPath)
    try
        do shell script "/bin/test -f " & quoted form of (folderPath & "/prototype/workflow/server.mjs") & " && /bin/test -f " & quoted form of (folderPath & "/prototype/index.html")
        return true
    on error
        return false
    end try
end isProject

on run
    try
        set appPath to POSIX path of (path to me)
        set parentPath to do shell script "/usr/bin/dirname " & quoted form of (text 1 thru -2 of appPath)
        set candidates to {parentPath, parentPath & "/动效工作台"}
        try
            set savedPath to do shell script "/usr/bin/defaults export com.guangjun.motionarchive - | /usr/bin/plutil -extract projectRoot raw -o - -"
            set end of candidates to savedPath
        end try
        set end of candidates to (POSIX path of (path to desktop folder)) & "动效工作台"
        set projectRoot to ""
        repeat with candidate in candidates
            if my isProject(candidate as text) then
                set projectRoot to candidate as text
                exit repeat
            end if
        end repeat
        repeat while projectRoot is ""
            set selectedFolder to choose folder with prompt "请选择动效工作台项目文件夹（包含 prototype 的文件夹）。移动或改名后只需重新选择一次。"
            set selectedPath to POSIX path of selectedFolder
            if my isProject(selectedPath) then
                set projectRoot to selectedPath
            else
                display dialog "这个文件夹不是工作台项目，请选择包含 prototype 文件夹的项目目录。" buttons {"重新选择", "取消"} default button "重新选择" cancel button "取消"
            end if
        end repeat
        do shell script "/usr/bin/defaults write com.guangjun.motionarchive projectRoot -string " & quoted form of projectRoot
        set launcherPath to POSIX path of (path to resource "start-workbench.sh")
        do shell script "/usr/bin/env " & quoted form of ("WORKBENCH_PROJECT_ROOT=" & projectRoot) & " /bin/zsh " & quoted form of launcherPath
    on error messageText number errorNumber
        if errorNumber is not -128 then
            try
                do shell script "/usr/bin/printf %s " & quoted form of messageText & " > /tmp/motion-workbench-launch-error.log"
            end try
            display dialog messageText with title "动效工作台启动失败" buttons {"好"} default button "好" with icon caution
        end if
    end try
end run
