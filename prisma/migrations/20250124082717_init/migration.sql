-- CreateTable
CREATE TABLE `Koordinat` (
    `x1` DOUBLE NOT NULL,
    `y1` DOUBLE NOT NULL,
    `x2` DOUBLE NOT NULL,
    `y2` DOUBLE NOT NULL,
    `id` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
