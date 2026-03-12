const computeMetricTotal = (rawMetrics: { id: number, value: number }[]) => {

    return rawMetrics.reduce((sum, item) => sum + item.value, 0)
}

const computeColorSummary = (photos: {id: number, color: string}[]) => {

    return photos.reduce((acc, photo) =>{
        acc[photo.color] = (acc[photo.color] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)
}

const computeAverageScore = (reportRows: {id: number, title: string, score: number}[]) => {
    return Math.round(reportRows.reduce((sum, row) => sum + row.score, 0) / reportRows.length)
}


export { computeMetricTotal, computeColorSummary, computeAverageScore }