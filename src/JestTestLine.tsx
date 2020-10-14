/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"
import styled from "styled-components"

const Container = styled.div`
    display: flex;
`

const Status = styled.div`
    flex: 0;
    min-width: 50px;
    margin-right: 20px;
    text-align: center;
`

const Line = styled.div`
    flex: 1;
`

export enum JEST_STATUS {
    PASS = "PASS",
    RUNS = "RUNS",
    FAIL = "FAIL",
}

export interface JestStatusLineProps {
    status: JEST_STATUS
    filePath: string
    fileName: string
    time: number
}

const getStatusColor = (status: JEST_STATUS) => {
    switch (status) {
        case JEST_STATUS.RUNS:
            return "#b3be63"
        case JEST_STATUS.FAIL:
            return "#9a464b"
        case JEST_STATUS.PASS:
            return "#42e05f"
    }
}

export const JestTestLine = ({
    status,
    filePath,
    fileName,
    time,
    onFinish,
}: JestStatusLineProps & { onFinish: (id: number) => void }) => {
    const statusColor = getStatusColor(status)

    useEffect(() => {
        if (status === JEST_STATUS.RUNS) {
            setTimeout(onFinish, time)
        }
    }, [])

    return (
        <Container>
            <Status
                style={{
                    background: statusColor,
                    color: "#000",
                    fontWeight: 600,
                    padding: "0 0",
                    height : "17px"
                }}
            >
                {status}
            </Status>
            <Line>
                <span style={{ opacity: 0.6 }}>{filePath}</span>
                <span style={{ fontWeight: 600 }}>{fileName}</span>
                {status === JEST_STATUS.PASS && time > 10000 && (
                    <span style={{ marginLeft: "10px" }}>
                        (
                        <span
                            style={{
                                color: "#FFF",
                                fontWeight: 600,
                                background: "#9a464b",
                            }}
                        >
                            {(time / 1000).toFixed(3)}s
                        </span>
                        )
                    </span>
                )}
            </Line>
        </Container>
    )
}
