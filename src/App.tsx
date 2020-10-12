import {
    CommandMapping,
    defaultCommandMapping,
    EmulatorState,
    FileSystem,
    OutputFactory,
} from "javascript-terminal"
import React from "react"
import { ReactOutputRenderers, ReactTerminal } from "react-terminal-component"
import "./App.css"
import { CUSTOM_TYPE } from "./constants"
import { JestComponent } from "./JestComponent"

export const App = () => {
    const customState = EmulatorState.create({
        fs: FileSystem.create({
            "/home": {},
            "/home/CREDITS": { content: "https://patsnacks.com" },
            "/home/projects/": {},
            "/home/projects/your-app": {},
            "/home/projects/your-app/.gitignore": {
                content: `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
      `,
            },
        }),
        commandMapping: CommandMapping.create({
            ...defaultCommandMapping,
            print: {
                function: (state: any, opts: any) => {
                    const input = opts.join(" ")

                    return {
                        output: OutputFactory.makeTextOutput(input),
                    }
                },
                optDef: {},
            },
            man: {
                function: (state: any, opts: any) => {
                    const selection = opts[0]
                    // No selection made
                    if (!selection) {
                        return {
                            output: OutputFactory.makeTextOutput(
                                "What manual page do you want?"
                            ),
                        }
                    }

                    // The golden goose
                    if (selection === "watchtestspass.com") {
                        return {
                            output: OutputFactory.makeTextOutput("Just type jest"),
                        }
                    }

                    // Fallback
                    return {
                        output: OutputFactory.makeTextOutput(
                            `No manual entry for ${selection}`
                        ),
                    }
                },
                optDef: {},
            },
            jest: {
                function: (state: any, opts: any) => {
                    return {
                        output: new OutputFactory.OutputRecord({
                            type: CUSTOM_TYPE.JEST,
                            content: {},
                        }),
                    }
                },
                optDef: {},
            },
        }),
    })

    return (
        <header>
            <main>
                <ReactTerminal
                    inputStr="man watchtestspass.com"
                    emulatorState={customState}
                    outputRenderers={{
                        ...ReactOutputRenderers,
                        [CUSTOM_TYPE.JEST]: JestComponent,
                    }}
                    theme={{
                        background: "#141313",
                        promptSymbolColor: "#6effe6",
                        commandColor: "#fcfcfc",
                        outputColor: "#fcfcfc",
                        errorOutputColor: "#ff89bd",
                        fontSize: "1.1rem",
                        spacing: "1%",
                        fontFamily: "monospace",
                        width: "calc(100vw - 50px)",
                        height: "calc(100vh - 50px)",
                    }}
                />
            </main>
        </header>
    )
}
