import { IsNotEmpty, IsString, IsDateString, IsNumber, IsInt, Length, Min, Max, } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsInt()
    @Min(10000000)
    @Max(99999999)
    zip_code: number

    @IsDateString()
    deadline: string | Date

    @IsNumber()
    cost: number
}