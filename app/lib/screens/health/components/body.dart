import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return Column(
          children: [
            Container(
                margin: EdgeInsets.all(20),
                padding: EdgeInsets.all(20),
                child: Table(
                  children: [
                    TableRow(children: [
                      Text(
                        'สุขภาพ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: 'ยอดเยี่ยม'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'ส่วนสูง',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: '170 ซม.'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'น้ำหนัก',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: '53 กก.'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'กรุ๊ปเลือด',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: 'A'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'ความดัน',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: '120/80'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'อัตราการเต้นของหัวใจ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller: TextEditingController(text: '80 bpm'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ]),
                    rowSpacer,
                    TableRow(children: [
                      Text(
                        'อุณหภูมิ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          height: 2.2,
                        ),
                      ),
                      TextField(
                          style: TextStyle(
                            height: 0.5,
                          ),
                          controller:
                              TextEditingController(text: '36.7 องศาเซลเซียส'),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                          )),
                    ])
                  ],
                ),
                width: double.infinity,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.white,
                    border: Border.all(
                      color: Colors.grey,
                      style: BorderStyle.solid,
                      width: 1,
                    ))),
            IconButton(
              icon: Image.asset('assets/images/fetus.png'),
              iconSize: 150,
              onPressed: () {},
            ),
          ],
        );
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
