# Learning Platform - AWS Architecture Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Architecture Diagram](#architecture-diagram)
- [Service Overview](#service-overview)
- [Adherence to AWS Well-Architected Framework](#adherence-to-aws-well-architected-framework)
    - [1. Security](#1-security)
    - [2. Operational Excellence](#2-operational-excellence)
    - [3. Reliability](#3-reliability)
    - [4. Performance Efficiency](#4-performance-efficiency)
    - [5. Cost Optimization](#5-cost-optimization)
- [CloudFormation Stacks](#cloudformation-stacks)
- [Conclusion](#conclusion)

## Project Overview
The project is a nested stack which adheres to AWS well-architected framework. Easy, ready to go stacks for faster deployment of your project.

## Architecture Diagram
![Architecture Diagram](report/Architecture.png)

## Service Overview

### Compute
- **EC2:** Hosts the Express.js backend application and the React frontend application.
- **Lambda:** Automates the creation of AMI images upon EC2 instance creation events.

### Database
- **RDS:** Manages the MySQL database for the application.

### Networking & Content Delivery
- **VPC:** Provides a secure network for the application.
- **Elastic Load Balancing:** Distributes traffic for both frontend and backend applications, with public and internal load balancers.

### Management & Governance
- **CloudFormation:** Implements Infrastructure as Code (IaC) for the entire infrastructure.
- **Auto Scaling:** Adjusts resource provisioning based on demand.
- **CloudWatch:** Monitors and logs activities across AWS services.
- **CloudTrail:** Logs API calls for auditing and monitoring infrastructure activities.

### Security
- **IAM:** Manages roles and permissions with instance profiles for frontend and backend applications.
- **Security Groups:** Controls inbound and outbound traffic at the instance level.

## Adherence to AWS Well-Architected Framework

### 1. Security
- **Logging and Monitoring:**
    - **CloudWatch and CloudTrail** ensure that all activities are logged and monitored.
    - EC2 instances have logging configured via user data scripts.
- **Infrastructure Protection:**
    - **VPC and Security Groups** are utilized to segment resources and control traffic, protecting the infrastructure at each network layer.

### 2. Operational Excellence
- **Infrastructure as Code:**
    - **AWS CloudFormation** is used to manage infrastructure, ensuring consistent, repeatable, and automated deployments.
- **Monitoring and Logging:**
    - **CloudWatch** is configured to monitor metrics, track logs, and set alarms for proactive management.

### 3. Reliability
- **High Availability:**
    - Resources are distributed across multiple Availability Zones (AZs) to ensure high availability.
- **Health Checks and Auto-Healing:**
    - **Elastic Load Balancing and Auto Scaling** manage traffic distribution and instance scaling, ensuring the application remains operational even during failures.
- **Automated Backups:**
    - **Amazon RDS** provides options for automated backups and snapshots, ensuring data durability.

### 4. Performance Efficiency
- **Dynamic Scaling:**
    - **Elastic Load Balancing and Auto Scaling** dynamically adjust resource allocation based on traffic and demand.
- **Efficient Resource Use:**
    - EC2 instances are right-sized to avoid over-provisioning and ensure efficient use of resources.

### 5. Cost Optimization
- **Monitoring Resource Usage:**
    - **AWS Cost Explorer** can be used to analyze cost and usage trends, helping identify cost drivers and savings opportunities.
- **Right-Sizing:**
    - **EC2 Instances** are selected based on performance needs to optimize costs.
- **Pay-As-You-Go:**
    - **Lambda** and **CloudFormation** services align costs with actual usage, helping manage expenses.

## CloudFormation Stacks
The project is managed using multiple CloudFormation stacks, each responsible for different parts of the infrastructure. This approach follows best practices for modular, manageable, and scalable infrastructure as code (IaC).

## Conclusion
The architecture of the learning platform is well-aligned with the AWS Well-Architected Framework. The chosen services and configurations ensure a secure, efficient, reliable, and cost-effective deployment. The use of AWS services like EC2, RDS, VPC, CloudFormation, Auto Scaling, Elastic Load Balancing, CloudWatch, and CloudTrail demonstrates a robust approach to building a scalable, high-performance, and cost-efficient architecture.
