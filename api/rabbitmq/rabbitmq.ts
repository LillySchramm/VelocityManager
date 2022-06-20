import * as amqp from 'amqplib';
import { env } from 'process';
import { Observable, Subject } from 'rxjs';

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

    public listen(queueName: string): Observable<string> {
        const messageObservable = new Subject<string>();

        this.channel.consume(
            queueName,
            async (message) => {
                if (!message) return;

                messageObservable.next(message.content.toString());
            },
            { noAck: true }
        );

        return messageObservable;
    }
}
