interface Interaction {
    id: string;
    timestamp: string;
    sourceId: string;
    source: string;
    sourceCompany: string;
    targetId: string;
    target: string;
    targetCompany: string;
    type: 'Phone' | 'Message' | 'Email';
    description: string;
}

export default Interaction;