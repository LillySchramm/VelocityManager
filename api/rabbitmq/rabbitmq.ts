import * as amqp from 'amqplib';
import { Observable, Subject } from 'rxjs';
import { RABBIT_MQ_URI } from '../tools/config';

export class RabbitMQ {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;

    constructor() {}

    public async init(): Promise<void> {
        this.connection = await amqp.connect(RABBIT_MQ_URI);
        this.channel = await this.connection.createChannel();
    }

    public async sendMessage(
        queueName: string,
        message: string
    ): Promise<void> {
        this.channel.sendToQueue(queueName, Buffer.from(message));
    }

    public async assertQueue(
        queueName: string,
        durable: boolean = false,
        _arguments: any = {}
    ) {
        await this.channel.assertQueue(queueName, {
            durable,
            arguments: _arguments,
        });
    }

    public listen(queueName: string): Observable<any> {
        const messageObservable = new Subject<any>();

        this.channel.consume(queueName, async (message) => {
            if (!message) return;

            const rawMessage = message.content.toString();
            messageObservable.next(JSON.parse(rawMessage));

            this.channel.ack(message);
        });

        return messageObservable;
    }
}
