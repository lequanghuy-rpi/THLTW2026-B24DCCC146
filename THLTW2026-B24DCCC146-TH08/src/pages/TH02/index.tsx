import { Card, Button, List} from 'antd'
import React, {useState} from 'react'
type Choice = 'Kéo' | 'Búa' | 'Bao'
const choices: Choice[] = ['Kéo', 'Búa', 'Bao']
const Th02: React.FC = ()=>{
    const [lichsu, setlichsu] = useState<any[]>([])
    const playGame = (nguoichoi: Choice)=>{
        const robot = choices[Math.floor(Math.random()*3)]
        let result = ''
        if (nguoichoi === robot){
            result = 'Hòa'
        }
        
        if (nguoichoi === 'Kéo'&& robot === 'Bao'|| nguoichoi === 'Búa'&& robot === 'Kéo'|| nguoichoi ==='Bao'&& robot === 'Búa'){
            result = 'Thắng'
        
        }else{
            result = 'Thua'
        }
        const newResult ={
            round: lichsu.length +1,
            nguoichoi: nguoichoi,
            robot: robot,
            result: result,
        };
        setlichsu([newResult,...lichsu]);
    }
    return(
        <Card title="Bài 2 TH02 - Oẳn Tù Tì" style={{ maxWidth: 500, margin: '20px auto' }}>
            <p>Chọn một để chơi:</p>
            <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
                {choices.map(c => (
                    <Button key={c} type="primary" onClick={() => playGame(c)}>{c}</Button>
                ))}
            </div>

            <List
                header={<b>Lịch sử các ván:</b>}
                bordered
                dataSource={lichsu}
                renderItem={(item) => (
                    <List.Item>
                        Ván {item.round}: {item.nguoichoi} vs {item.robot} - <b>{item.result}</b>
                    </List.Item>
                )}
            />
        </Card>
    )
    
    
}

export default Th02;