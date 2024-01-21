# IMPORTANT

### Setup
**1. Cài SQLServer**
- Cách 1: Bằng docker
	+ Cài docker
	+ cd đến đường dẫn chứa 2 file docker-compose.yml và docker-compose.override.yml
	+ Chạy docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d --remove-orphans
	+ Để down service chạy: docker-compose down

- Cách 2: Cài tool SQLServer =>> google

**2. Migrations DB**
- Lần đầu: dotnet tool install --global dotnet-ef
- cd vào thư mục chứa project NewAPI
- Open command line run:  
	+ dotnet ef migrations add "SampleMigration1" --output-dir Persistence/Migrations
	+ dotnet ef database update

**3. Drop database**

```sql
USE master;
GO
ALTER DATABASE News SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE News;
GO
```
