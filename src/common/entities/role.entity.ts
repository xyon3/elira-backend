import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @OneToMany(() => User, (user) => user.role, { lazy: true })
    users: User[];
}
