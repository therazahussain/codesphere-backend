const ACTIONS = {
    JOIN: 'join',
    JOINED: 'joined',
    DISCONNECTED: 'disconnected',
    CODE_CHANGE: 'code-change',
    SYNC_CODE: 'sync-code',
    SYNC_DROPDOWN: 'dropdown_sync',
    DROPDOWN_CHANGE: 'change_dropdown',
    RUN_TRIGGER: 'runbutton_click',
    FREEZE_CHANGE: 'freeze_change',
    SEND_OUTPUT: "send_output",
    SET_OUTPUT: "set_output",
    ERROR_RUNNING: "error_while_running",
    UNFREEZE_USER:"enable_run_button",
    LEAVE: 'leave',
};

module.exports = ACTIONS;