import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Logs {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({nullable:false})
    actor: string;

    @Column({nullable:false})
    action: string;

    @Column({nullable:false})
    description: string;

    @Column({name: "session_id", nullable:false})
    sessionID: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    datetime: string;
}
