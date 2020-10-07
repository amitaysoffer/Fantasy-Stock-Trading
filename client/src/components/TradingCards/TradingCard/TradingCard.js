import React from 'react';
import classes from './TradingCard.module.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from '../../Modal/Modal';
import useModal from '../../../hooks/useModal';
import CardHeader from './CardHeader/CardHeader';
import CardBody from './CardBody/CardBody';
import SharesForm from '../../Forms/SharesForm/SharesForm';

const TradingCard = (props) => {
    const title = `${props.title}: ${props.subtitle}`;
    
    const buyModal = useModal();
    const sellModal = useModal();

    return (
        <div className={classes.TradingCard}>
            <Card style={{ width: "100%" }}>
                <Card.Title>
                    <CardHeader 
                        title={title} 
                        handleShowBuyModal={buyModal.handleShowModal} 
                        handleShowSellModal={sellModal.handleShowModal}/>
                </Card.Title>
                <Card.Body>
                    <CardBody price={props.price} percentage={props.percentage} daily={props.daily}/>
                </Card.Body>
            </Card>

            <Modal 
                show={buyModal.show} 
                close={buyModal.handleCloseModal} 
                title={title}
                footer={<Button>Buy</Button>}>
                    <SharesForm price={props.price}/>
            </Modal>
            <Modal 
                show={sellModal.show} 
                close={sellModal.handleCloseModal} 
                title={title} 
                footer={<Button>Sell</Button>}>
                    <SharesForm price={props.price}/>
            </Modal>
        </div>
    );
};

export default TradingCard;