import commander from "../../";

export const silentCommand = (...args) => {
    const command = new commander.Command(...args)
        .configureOutput({
        writeOut: () => {},
        writeErr:  () => {},
        outputError: () => {}
        })
    return command
}