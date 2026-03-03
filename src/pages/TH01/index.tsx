import { Card, Input, Button, message,Alert } from 'antd';
import React, { useState, useEffect } from 'react';

const Th01: React.FC = () => {
    const [target, setTarget] = useState<number>(() => Math.floor(Math.random() * 100) + 1);
    const [guess, setGuess] = useState<string>('');
    const [min, setmin] = useState(0);
    const max = 10;

    const resetGame = () => {
        setTarget(Math.floor(Math.random() * 100) + 1);
        setGuess('');
        setmin(0);
    };

    const onSubmit = () => {
        const num = parseInt(guess, 10);
        if (isNaN(num) || num < 1 || num > 100) {
            message.warning('Vui lòng nhập số từ 1 đến 100');
            return;
        }
        
        
        setmin(a => a + 1);
        if (num === target) {
            message.success('Yes. Bạn đã đoán đúng');
        } else if (num < target) {
            message.info('Bạn đoán quá thấp');
        } else {
            message.info('Bạn đoán quá cao');
        }
    };

    

    return (
        <Card bodyStyle={{ height: '100%' }}>
            <h1>Bài 1 TH01 - Đoán số</h1>
            <p> Mời bạn đoán. Số đó thuộc khoảng từ 1 đến 100.</p>
            <div style={{ marginTop: 16 }}>
                <Input
                    style={{ width: 200 }}
                    value={guess}
                    onChange={e => setGuess(e.target.value)}
                    onPressEnter={onSubmit}
                    placeholder="Nhập số của bạn dự đoán"
                    disabled={min >= max}
                />
                <Button type="primary" onClick={onSubmit} style={{ marginLeft: 8 }} disabled={min >= max}>
                    Đoán
                </Button>
                <Button onClick={resetGame} style={{ marginLeft: 8 }}>
                    Chơi lại
                </Button>
            </div>
            <div style={{ marginTop: 12 }}>
                <p>Lượt đã dùng: {min} / 10</p>
                {min >=max && (<Alert message={`Hết lượt số đúng là " ${target} " chúc may mắn lần sau`} type='error'></Alert>)}
            </div>
        </Card>
    );
};

export default Th01;