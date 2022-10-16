export enum MaintenanceCommand {
    RELOAD = 'RELOAD',
    RESTART = 'RESTART',
}

export interface MaintenanceMessage {
    command: MaintenanceCommand;
}
