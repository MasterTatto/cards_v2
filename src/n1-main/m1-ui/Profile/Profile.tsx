import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {AppRootStateType} from "../../m2-bll/store";
import ContainerAuth from "../common/c4-containerAuth";
import React, {useEffect} from "react";
import styles from "./styles.profile.module.scss";
import LeftPage from "./LeftPage";
import RightPage from "./RightPage";
import {getCardsPack} from "./profileReducer";

export const Profile = () => {
    const dispatch = useDispatch()
    const sortCards = useSelector<AppRootStateType, number>((state) => state.profile.sortByCards)
    const sortName = useSelector<AppRootStateType, string>((state) => state.profile.sortName)
    const packName = useSelector<AppRootStateType, string>(state => state.profile.packName)
    const page = useSelector<AppRootStateType, number>(state => state.profile.page)
    const rowsPerPage = useSelector<AppRootStateType, number>(state => state.profile.rowsPerPage)
    const minValue = useSelector<AppRootStateType, number>(state => state.profile.min)
    const maxValue = useSelector<AppRootStateType, number>(state => state.profile.max)
    const userId = useSelector<AppRootStateType, string>(state => state.profile.user_id)

    useEffect(() => {
        dispatch(getCardsPack(sortCards, sortName, minValue, maxValue, userId))
    }, [dispatch, sortCards, sortName, packName, page, rowsPerPage, minValue, maxValue, userId])

    const inAuth = useSelector<AppRootStateType, boolean>((state) => state.app.inAuth)
    if (!inAuth) return <Navigate to={'/login'}/>

    return (
        <ContainerAuth>
            <div className={styles.main}>
                <LeftPage/>
                <RightPage/>
            </div>
        </ContainerAuth>

    )
}