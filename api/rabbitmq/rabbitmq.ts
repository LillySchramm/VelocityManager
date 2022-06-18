import * as amqp from 'amqplib';
import { env } from 'process';
import { BehaviorSubject, Observable } from 'rxjs';

export class RabbitMQ {
    private URI = env.RABBIT_MQ_URL || 'amqp://localhost';

    private connection!: amqp.Connection;
    private channel!: amqp.Channel;

    constructor() {}

    public async init(): Promise<void> {
        this.connection = await amqp.connect(this.URI);
        this.channel = await this.connection.createChannel();
    }

    public async sendMessage(
        queueName: string,
        message: string
    ): Promise<void> {
        await this.channel.assertQueue(queueName, {
            durable: false,
        });

        this.channel.sendToQueue(queueName, Buffer.from(message));
    }

    public listen(queueName: string): Observable<string> {
        const messageObservable = new BehaviorSubject<string>('');

        this.channel
            .assertQueue(queueName, {
                durable: false,
            })
            .then(() => {
                this.channel.consume(
                    queueName,
                    async (message) => {
                        if (!message) return;

                        messageObservable.next(message.content.toString());
                    },
                    { noAck: true }
                );
            });

        return messageObservable;
    }
}
