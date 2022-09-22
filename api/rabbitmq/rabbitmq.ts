import * as amqp from 'amqplib';
import { Observable, Subject } from 'rxjs';
import { RABBIT_MQ_PREFIX, RABBIT_MQ_URI } from '../tools/config';
import { logger } from '../tools/logging';

export class RabbitMQ {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;

    constructor() {}

    public async init(): Promise<void> {
        this.connection = await amqp.connect(RABBIT_MQ_URI);
        this.channel = await this.connection.createChannel();
    }

    private patchQueueName(name: string): string {
        return RABBIT_MQ_PREFIX ? `${RABBIT_MQ_PREFIX}.${name}` : name;
    }

    public async sendMessage(
        queueName: string,
        message: string
    ): Promise<void> {
        const name = this.patchQueueName(queueName);
        this.channel.sendToQueue(name, Buffer.from(message));
    }

    public async assertQueue(
        queueName: string,
        durable: boolean = false,
        _arguments: any = {}
    ) {
        const name = this.patchQueueName(queueName);
        logger.info(`Asserting Queue '${name}'`);
        await this.channel.assertQueue(name, {
            durable,
            arguments: _arguments,
        });
    }

    public listen(queueName: string): Observable<any> {
        const messageObservable = new Subject<any>();
        const name = this.patchQueueName(queueName);
        logger.info(`Listening on Queue '${name}'`);

        this.channel.consume(
            this.patchQueueName(queueName),
            async (message) => {
                if (!message) return;

                const rawMessage = message.content.toString();
                messageObservable.next(JSON.parse(rawMessage));

                this.channel.ack(message);
            }
        );

        return messageObservable;
    }
}
