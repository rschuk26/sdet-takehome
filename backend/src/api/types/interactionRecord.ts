interface InteractionRecord {
    id: number;
    type: 'Phone' | 'Message' | 'Email';
    description: string;
    timestamp: string;
    source_id: string;
    source_name: string;
    source_company: string;
    target_id: string;
    target_name: string;
    target_company: string;
}

export default InteractionRecord;