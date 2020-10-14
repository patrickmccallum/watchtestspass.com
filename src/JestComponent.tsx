import React, { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { JestStatusLine } from "./JestStatusLine"
import { Timer } from "./Timer"
import { JEST_STATUS, JestTestLine, JestStatusLineProps } from "./JestTestLine"
import { BEGINNINGS, ENDINGS, FILE_TYPES } from "./words"

const JestContainer = styled.div`
    height: calc(80vh - 50px);
    display: flex;
    flex-direction: column;
`

const Passes = styled.div`
    flex: 1 20%;
    overflow: hidden;
    margin-bottom : 5px;
`

const Runs = styled.div`
    flex: 1 60%;
    overflow: hidden;
    margin-bottom : 5px;
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

const JEST_TEST_LINE_HEIGHT = 17; // This is the height of JestTestLine.. I have set it to 17px in the JestTestLine.tsx as well

const getNumStatusLines = function(idOfContainer: string){ // This helps us calculate how many JestTestLines can come inside the container with given ID( without cutting)
    let container = document.getElementById(idOfContainer);
    let containerHeight = container?.clientHeight;
    let numStatusLines = containerHeight ? Math.floor(containerHeight/JEST_TEST_LINE_HEIGHT) : 50; // 50 is just any nuumber
    return numStatusLines;
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

    let [numberPasses, setNumberPasses] = useState(getNumStatusLines("passesContainer")); //Number of pass lines that can fit inside the parent container
    let [numberRuns, setNumberRuns] = useState(getNumStatusLines("runsContainer")); // Number of run lines that can fit inside the parent container

    useEffect(() => {
        function handleResize(){
            setNumberPasses(getNumStatusLines("passesContainer"));
            setNumberRuns(getNumStatusLines("runsContainer"));
        }
        window.addEventListener("resize", handleResize);    //Attaching event listener to adjust how many lines fit inside the container on resizing the window
        return () => window.removeEventListener("resize", handleResize);
    },[]);

    return (
        <JestContainer >
            <Passes id="passesContainer">
                {finishedTests.slice(0,numberPasses).map((testObject) => { //Sliced the array to show only first few entries, as rest would not be displayed because of overflow
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
            <Runs id="runsContainer">
                {Object.values(runningTests).slice(0,numberRuns).map((testObject) => {
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
