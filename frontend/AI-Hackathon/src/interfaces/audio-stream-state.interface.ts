/**
 * Interface representing an Audio Stream State
 */
export interface AudioStreamState  {
    playing: boolean,
    canplay: boolean,
    currentTime: number | null,
    readableCurrentTime: string,
    duration: number | null,
    readableDuration: string,
    error: boolean
}