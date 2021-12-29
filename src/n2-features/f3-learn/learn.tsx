import React, {useEffect, useState} from 'react';
import styles from "./style.module.scss"
import {CardType, getLearnCards, rateCardTC} from "../f2-cards/c2-bll/cardsReducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../n1-main/m2-bll/store";
import {useParams} from "react-router-dom";
import ContainerAuth from "../../n1-main/m1-ui/common/c4-containerAuth";
import Button from '@material-ui/core/Button/Button';


const Learn = () => {
    const cards = useSelector<AppRootStateType, any>(state => state.cards.cards?.cards)
    const dispatch = useDispatch()
    const {id} = useParams<string>()
    const [card, setCard] = useState<any>({});
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [valueGrade, setValueGrade] = useState<number>(0)

    const rating = [
        {name: 'Не знаю', value: 1},
        {name: 'Забыл', value: 2},
        {name: 'Долго думал', value: 3},
        {name: 'Перепутал', value: 4},
        {name: 'Ответил', value: 5},
    ]

    useEffect(() => {
        dispatch(getLearnCards(id))
    }, [dispatch, id])

    useEffect(() => {
        console.log('cards', cards)
        if (cards?.length > 0) setCard(getCard(cards));
    }, [cards]);

    const getCard = (cards: CardType[]) => {
        const sum = cards.reduce((acc, card) => acc + (6 - card.grade) * (6 - card.grade), 0);
        const rand = Math.random() * sum;
        const res = cards.reduce((acc: { sum: number, id: number }, card, i) => {
                const newSum = acc.sum + (6 - card.grade) * (6 - card.grade);
                return {sum: newSum, id: newSum < rand ? i : acc.id}
            }
            , {sum: 0, id: -1});
        console.log('test: ', sum, rand, res)

        return cards[res.id + 1];
    }

    const onNext = () => {
        if (cards?.length > 0) {
            setCard(getCard(cards));
            setIsChecked(false)
        }
    }

    const onCheck = () => {
        setIsChecked(!isChecked)
    }

    const rateCard = (grade: number, card_id: string) => {
        if (valueGrade <= 0) return
        dispatch(rateCardTC(grade, card_id))
    }

    return <ContainerAuth>
        <div className={styles.learnBlock}>
            {
                !isChecked ? (
                    <>
                        <div className={styles.text}>Question: {card.question}</div>
                    </>
                ) : (
                    <>
                        <div className={styles.text}>Answer: {card.answer}</div>
                        <div className={styles.answerButtons}>
                            {rating.map((g, i) => (
                                <Button disabled={g.value === valueGrade}
                                        key={'grade-' + i}
                                        onClick={() => {
                                            setValueGrade(g.value)
                                        }}
                                        style={{
                                            background: `${valueGrade === g.value ? 'green' : '#21268F'}`,
                                            color: '#fff',
                                            height: '40px',
                                            width: '140px'
                                        }}
                                >
                                    {g.name}
                                </Button>
                            ))}
                        </div>

                    </>
                )
            }
            <div className={styles.actionButtons}>
                <div>
                    {!isChecked ? <Button onClick={onCheck} style={{
                        background: '#21268F',
                        color: '#fff',
                        height: '40px',
                        width: '150px'
                    }}>check</Button> : <Button style={{
                        background: '#D7D8EF',
                        color: '#21268F',
                        padding: '10px'
                    }} onClick={onCheck}>Back to the question</Button>}
                </div>
                <div>
                    <Button style={{
                        background: '#D7D8EF',
                        color: '#21268F',
                        height: '40px',
                        width: '150px'
                    }} onClick={() => {
                        onNext()
                        rateCard(valueGrade, card._id)
                        setValueGrade(0)
                    }
                    }>Next question
                    </Button>
                </div>
            </div>
        </div>

    </ContainerAuth>


}

export default Learn;