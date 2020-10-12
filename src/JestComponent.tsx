import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { JestStatusLine } from "./JestStatusLine"
import { Timer } from "./Timer"
import { JEST_STATUS, JestTestLine, JestStatusLineProps } from "./JestTestLine"
import { BEGINNINGS, ENDINGS, FILE_TYPES } from "./words"

const JestContainer = styled.div`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
`

const Passes = styled.div`
    flex: 1 20%;
    overflow: hidden;
    margin-bottom: 10px;
`

const Runs = styled.div`
    flex: 1 50%;
`

const Stats = styled.div`
    flex: 1;
`

interface TestsCollection {
    [testId: number]: JestStatusLineProps & { id: number }
}

const generateTest = (
    id: number
): { id: number; test: JestStatusLineProps & { id: number } } => {
    let fileNameStart = "",
        fileNameEnding = ENDINGS[Math.floor(Math.random() * ENDINGS.length)],
        fileType = FILE_TYPES[Math.floor(Math.random() * FILE_TYPES.length)]

    const nameComplexity = Math.ceil(Math.random() * 3)

    for (let i = 0; i < nameComplexity; i++) {
        fileNameStart = `${fileNameStart}${
            BEGINNINGS[Math.floor(Math.random() * BEGINNINGS.length)]
        }`
    }

    return {
        id,
        test: {
            id,
            fileName: `${fileNameStart}${fileNameEnding}${fileType}`,
            filePath: `src/app/__tests__/${fileNameStart}${fileNameEnding}/`,
            status: JEST_STATUS.RUNS,
            time: Math.random() * 23000,
        },
    }
}

export const JestComponent = () => {
    const [runningTests, setRunningTests] = useState<TestsCollection>({})
    const [finishedTests, setFinishedTests] = useState<
        Array<JestStatusLineProps>
    >([])
    const runningTestsRef = useRef<TestsCollection>({})
    const finishedTestsRef = useRef<Array<JestStatusLineProps>>([])
    const createdTestsRef = useRef(0)

    useEffect(() => {
        let initialTests: TestsCollection = {}

        while (createdTestsRef.current < 30) {
            const genTest = generateTest(createdTestsRef.current)
            initialTests[genTest.id] = genTest.test

            createdTestsRef.current++
        }

        setRunningTests(initialTests)
    }, [])

    useEffect(() => {
        runningTestsRef.current = runningTests
    }, [runningTests])

    useEffect(() => {
        finishedTestsRef.current = finishedTests
    }, [finishedTests])

    return (
        <JestContainer>
            <Passes>
                {finishedTests.map((testObject) => {
                    return (
                        <JestTestLine
                            status={JEST_STATUS.PASS}
                            filePath={`${testObject.filePath}`}
                            fileName={`${testObject.fileName}`}
                            time={testObject.time}
                            onFinish={() => {}}
                        />
                    )
                })}
            </Passes>
            <Runs>
                {Object.values(runningTests).map((testObject) => {
                    return (
                        <JestTestLine
                            key={testObject.id}
                            status={testObject.status}
                            filePath={`${testObject.filePath}`}
                            fileName={`${testObject.fileName}`}
                            time={testObject.time}
                            onFinish={(id: number) => {
                                // New running
                                let newRunning = { ...runningTestsRef.current }
                                const justFinished = {
                                    ...newRunning[testObject.id],
                                }
                                const replacementTest = generateTest(
                                    createdTestsRef.current
                                )
                                newRunning[replacementTest.id] =
                                    replacementTest.test
                                createdTestsRef.current++
                                delete newRunning[testObject.id]

                                // New finished
                                let newFinished = [...finishedTestsRef.current]
                                newFinished.unshift(justFinished)

                                setRunningTests(newRunning)
                                setFinishedTests(newFinished)
                            }}
                        />
                    )
                })}
            </Runs>
            <Stats>
                <JestStatusLine label={"Time:"} content={<Timer />} />
            </Stats>
        </JestContainer>
    )
}
